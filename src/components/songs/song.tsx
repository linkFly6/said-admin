import * as React from 'react'
import {
  Icon,
  Popconfirm,
  Upload,
  Modal,
  message,
  Progress,
  Spin,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
} from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import ImagesComponent from '../../components/images/images'
import * as s from './song.styl'
import { acceptMimetypes } from '../../types/song'
import { UploadChangeParam } from 'antd/lib/upload'
import { userReady } from '../../service/user'
import { inject, observer } from 'mobx-react'
import { List } from 'immutable'
import { SongStore } from '../../store/song'
import { SongModel } from '../../types/song'
import { Store } from '../../service/utils/store'
import { ImageModel, ImageType } from '../../types/image'


const store = new Store('other.view.song')

/**
 * 存在 store 中的 key
 * 用户最后一次选择的图片类型(过滤项)
 */
const SONGCACHENAME = 'songCache'

interface StateProps {
  songStore: SongStore,
}


const UploadProgress = (props: {
  isUploading: boolean,
  percent: number,
}) => {
  if (props.isUploading && props.percent < 100) {
    return (
      <Progress type="circle" percent={props.percent} />
    )
  }
  if (props.isUploading && props.percent >= 100) {
    return (
      <div>
        {/* <Icon type={'loading'} className={s.iconUpload} /> */}
        <Spin size="large" className={s.iconUpload} />
        <div className="ant-upload-text">处理中</div>
      </div>
    )
  }
  return (
    <div>
      <Icon type={'plus'} className={s.iconUpload} />
      <div className="ant-upload-text">点击上传</div>
    </div>
  )
}

const SongGrid = (props: {
  song: SongModel,
  /**
   * 是否正在删除
   */
  isDeleteting?: boolean,
  /**
   * 是否正在播放
   */
  isPlay: boolean,
  /**
   * 是否显示删除按钮
   */
  isShowDelete: boolean,
  /**
   * 点播放触发
   */
  onPlay: () => void
  /**
   * 点暂停触发
   */
  onPause: () => void
  /**
   * 删除触发
   */
  onDelete: () => void
}) => {
  const deleteContent = props.isDeleteting ?
    (
      <div className={s.deleteing}>
        <div className={s.deleteBox}>
          <Spin size="large" />
          <div className={s.deleteText}>删除中...</div>
        </div>
      </div>
    ) : ''
  const buttonsContent: Array<React.ReactNode> = []

  if (props.isPlay) {
    // 播放中，显示暂停按钮
    buttonsContent.push(<Icon type="pause-circle-o" title="点击暂停" />)
  } else {
    buttonsContent.push(<Icon type="play-circle-o" title="点击播放" />)
  }

  // 检测是否有删除权限
  if (props.isShowDelete) {
    buttonsContent.push(
      <Popconfirm
        title="确认是否删除？"
        okText="是"
        cancelText="否"
      >
        <Icon className={s.deleteButton} type="delete" />
      </Popconfirm>
    )
  }

  return (
    <div className={s.cardGrid}>
      <div className={s.card}>
        {deleteContent}
        <Card
          cover={
            <div
              className={`${s.image} ${s.player}`}
              style={{ backgroundImage: `url(${props.song.url})` }}
            />
          }
          actions={buttonsContent}
        >
          <Card.Meta
            title="Favours"
            description={
              <div className={s.detail}>
                <p><span title="歌手">{props.song.artist}</span> -<span title="专辑">《{props.song.album}》</span></p>
                <p className={s.flex}><span title="时长">03:222222312</span><span title="大小">10000T</span></p>
              </div>
            }
          />
        </Card>
      </div>
    </div>
  )
}


class FormItem extends React.Component<{
  label: string
}> {
  render() {
    return (
      <Form.Item>
        {
          this.props.children
        }
      </Form.Item>
    )
  }
}

interface ImageFormProps extends FormComponentProps {
  image?: ImageModel,
  onSelectImage: () => void
}
/**
 * 新增音乐组件
 */
class SongFormComponent extends React.Component<ImageFormProps> {

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col
            span={12}
          >
            <div
              className={`${s.formImageBox} ${this.props.image ? '' : s.error}`}
              onClick={() => { this.props.onSelectImage() }}
            >
              <Icon
                type="picture"
                className={s.iconLarge}
              >
                点击选择歌曲封面
              </Icon>
              <div className={s.formImage} />
            </div>
          </Col>
          <Col
            span={12}
          >
            <FormItem
              label="歌曲名称"
            >
              {
                getFieldDecorator(
                  'title',
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: '请输入歌曲名称' }],
                    // initialValue
                  })(
                  <Input
                    placeholder="歌曲名称"
                    autoComplete="off"
                  // onChange={this.createHandelChangeSaveToLocal('title')}
                  />
                  )
              }
            </FormItem>
            <FormItem label="歌手名称">
              {
                getFieldDecorator(
                  'artist',
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: '请输入歌手名称' }],
                    // initialValue
                  })(
                  <Input
                    placeholder="歌手名称"
                    autoComplete="off"
                  // onChange={this.createHandelChangeSaveToLocal('title')}
                  />
                  )
              }
            </FormItem>
            <FormItem label="专辑名称">
              {
                getFieldDecorator(
                  'album',
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: '请输入专辑名称' }],
                    // initialValue
                  })(
                  <Input
                    placeholder="专辑名称"
                    autoComplete="off"
                  // onChange={this.createHandelChangeSaveToLocal('title')}
                  />
                  )
              }
            </FormItem>
            <FormItem label="歌曲时长">
              <Input
                placeholder="歌曲时长"
                autoComplete="off"
                disabled
              // onChange={this.createHandelChangeSaveToLocal('title')}
              />
            </FormItem>
          </Col>
        </Row>
      </Form >
    )
  }
}

const FormAddSong = Form.create()(SongFormComponent)


interface ComponentState {
  uploading: boolean,
  percent: number,
  addModalVisible: boolean,
  loadingList: boolean,
  deleteList: List<string>,
  submiting: boolean,
  // 是否有文件被拖拽进来
  drag: boolean,
  /**
   * 选择图片弹窗
   */
  selectImageMoalVisible: boolean,
}

@inject((allStores: any) => ({
  admin: allStores.store.admin,
  songStore: allStores.store.song,
}))
@observer
export default class ImageComponents extends React.Component<StateProps, ComponentState> {
  state = {
    // 是否正在上传
    uploading: false,
    // 上传进度
    percent: 0,
    /**
     * 表单是否正在提交
     */
    submiting: false,
    addModalVisible: false,
    /**
     * 选择图片弹窗
     */
    selectImageMoalVisible: false,
    previewImage: null,
    deleteList: List<string>(),
    loadingList: false,
    drag: false,
  }

  /**
   * constructor 中不允许操作 state
   */
  componentWillMount() {
    this.load()
  }

  /**
   * props 改变，会触发的生命周期
   * @param nextProps 
   */
  componentWillReceiveProps(nextProps: StateProps) {
    // this.load()
  }

  async load() {
    const data: SongModel | null = store.val(SONGCACHENAME) as SongModel
    if (data) {
      this.setState({
        addModalVisible: true,
      })
    }
    // this.setState({
    //   loadingList: true
    // })
  }

  /**
   * 上传功能
   */
  handleRequest = (option: any) => {
    this.props.songStore.upload({
      file: option.file,
    }).then(returns => {
      if (!returns.check()) {
        message.error(`${returns.message}${returns.code == null ? '' : `(${returns.code})`}`)
      }
      message.success('上传成功')
      store.val(SONGCACHENAME, returns.data)
    })
  }

  /**
   * 提交
   */
  handleSubmit = () => {
    const form = this.refs.formImage as any

    form.validateFields(async (err, field: {
      title: string,
      artist: string[],
      album: string,
    }) => {
      console.log(err)
    })
  }

  handleSelectImage = () => {
    this.setState({
      selectImageMoalVisible: true
    })
  }

  render() {
    if (this.state.loadingList) {
      return (
        <div className={`${s} ${s.loading}`}>
          <Spin size="large" />
        </div>
      )
    }
    return (
      <div
        className={s.songComponents}
      // 和 Upload.Dragger 冲突了，这里没办法再处理了
      // onDragLeave={(e: any) => this.eventlog('leave', e)}
      >
        <div className={s.dropBox} style={{ display: this.state.drag ? 'block' : 'none' }}>
          <Upload.Dragger
            name="img"
            accept={acceptMimetypes.join(',')}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">拖拽文件上传</p>
          </Upload.Dragger>
        </div>
        <div className={s.cardBox}>
          <div className={s.uploadGrid}>
            <Modal
              title="选择歌曲封面"
              width={'80%'}
              closable={false}
              maskClosable={false}
              visible={this.state.selectImageMoalVisible}
            >
              <ImagesComponent
                imageType={ImageType.Music}
                image={void 0 as any}
              />
            </Modal>
            <Modal
              title="新增歌曲"
              closable={false}
              maskClosable={false}
              visible={this.state.addModalVisible}
              footer={
                <div>
                  <Button type="danger">取消</Button>
                  <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                </div>
              }
            >
              <FormAddSong
                ref="formImage"
                onSelectImage={this.handleSelectImage}
              />
            </Modal>
            <Upload
              name="img"
              customRequest={this.handleRequest}
              accept={acceptMimetypes.join(',')}
              listType="picture-card"
              showUploadList={false}
              disabled={this.state.uploading}
            >
              <UploadProgress percent={this.state.percent} isUploading={this.state.uploading} />
            </Upload>
          </div>
          {

          }
        </div>
      </div>
    )
  }
}