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
import SongForm, { saveCache, hasCache } from './song-from'




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


interface ComponentState {
  uploading: boolean,
  percent: number,
  addModalVisible: boolean,
  loadingList: boolean,
  deleteList: List<string>,
  submiting: boolean,
  // 是否有文件被拖拽进来
  drag: boolean,
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
    if (hasCache()) {
      this.setState({
        addModalVisible: true,
      })
    }
    // TODO 如果正在 loading 应该有 loading 动画
    this.props.songStore.query()
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
      saveCache(returns.data)
      this.setState({
        addModalVisible: true,
      })
    })
  }

  /**
   * 关闭上传表单
   */
  closeForm = () => {
    this.setState({
      addModalVisible: false,
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
              title="新增歌曲"
              closable={false}
              maskClosable={false}
              visible={this.state.addModalVisible}
              footer={null}
            >
              <SongForm
                ref="formImage"
                songStore={void 0 as any}
                onCancel={this.closeForm}
                onSuccess={this.closeForm}
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