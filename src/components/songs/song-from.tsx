import * as React from 'react'
import {
  Form,
  Row,
  Col,
  Icon,
  Input,
  Modal,
  message,
  Button,
  Popconfirm
} from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { ImageModel, ImageType } from '../../types/image'
import ImagesComponent from '../images/images'
import * as s from './song.styl'
import { observer, inject } from 'mobx-react'
import { SongStore } from '../../store/song'
import { Store } from '../../service/utils/store'
import { debounce } from '../../service/utils/index'
import { SongModel } from '../../types/song'
import { parseTime } from '../../service/utils/format'

const songStore = new Store('other.view.song')

/**
 * 存在 store 中的 key
 * 用户最后一次选择的图片类型(过滤项)
 */
const SONGCACHENAME = 'songCache'


/**
 * 创建一个存储到 Store 的方法，进行函数节流
 */
const save2Local = debounce<(value: SongModel) => void>((value: any) => {
  saveCache(value)
}, 300)


export const saveCache = (data: SongModel) => {
  songStore.val(SONGCACHENAME, data)
}

export const hasCache = () => {
  return songStore.has(SONGCACHENAME)
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


interface StateProps extends FormComponentProps {
  songStore: SongStore,
  onSuccess?: (song: SongModel) => void,
  onCancel?: () => void
}

interface ComponentState {
  /**
   * 选择图片框是否显示
   */
  selectImageModalVisible: boolean,
  /**
   * 正在使用的专辑封面图
   */
  image: ImageModel | null,
  /**
   * 选择中的专辑封面图
   */
  selectImage: ImageModel | null,
  /**
   * 是否显示图片未选择的错误
   */
  showImageSelectError: boolean,
  /**
   * 本地填写的缓存
   */
  cache: SongModel,

  // 加载中
  btnCancelIsLoading: boolean,
  btnSaveIsLoading: boolean
}

/**
 * 新增音乐组件
 */
@inject((allStores: any) => ({
  admin: allStores.store.admin,
  songStore: allStores.store.song,
}))
@observer
class SongFormComponent extends React.Component<StateProps, ComponentState> {

  state: ComponentState = {
    image: null,
    selectImageModalVisible: false,
    selectImage: null,
    showImageSelectError: false,
    cache: {} as any,
    btnCancelIsLoading: false,
    btnSaveIsLoading: false,
  }

  setStore = (name: string, value: any) => {
    const data = { ...this.state.cache }
    data[name] = value
    this.setState({
      cache: data,
    })
    save2Local(data)
  }


  // 不能挂载到 componentDidMount，因为这时候页面已经渲染了， cache 为空会导致逻辑出错
  componentWillMount() {
    const cache = songStore.val(SONGCACHENAME) || {}
    this.setState({
      cache,
      image: cache.image ? cache.image : null,
      selectImage: cache.image ? cache.image : null
    })
  }

  /**
   * 生成保存到 store 的函数
   */
  createHandelChangeSaveToLocal = (name: string) => {
    return (e: React.ChangeEvent<any>) => {
      this.setStore(name, e.target.value)
    }
  }

  /**
   * 关闭或取消选择图片
   */
  handleCloseSelectImageModal = () => {
    this.setState({
      selectImageModalVisible: false,
      // selectImage: null,
      showImageSelectError: !this.state.image
    })
  }

  /**
   * 确认选择图片，选择图片的容器点击确定之后
   */
  handleOKSelectImageModal = () => {
    if (!this.state.selectImage) {
      message.error('请选择歌曲封面图片(-10000)')
      return
    }
    this.setStore('image', this.state.selectImage)
    this.setState({
      selectImageModalVisible: false,
      image: this.state.selectImage,
      // 清空掉选择的图片
      selectImage: null,
    })
  }

  /**
   * 显示选择图片容器
   */
  handleShowSelectImageModal = () => {
    this.setState({
      selectImageModalVisible: true
    })
  }

  /**
   * 选择图片（注意，不是确认选择，而是每进行一次选择动作都会进行触发的事件）
   */
  handleSelectImage = (image: ImageModel) => {
    this.setState({
      selectImage: image,
    })
  }

  /**
   * 重置组件状态
   */
  reset = () => {
    songStore.clear()
    this.setState({
      image: null,
      selectImageModalVisible: false,
      selectImage: null,
      showImageSelectError: false,
      cache: {} as any,
      btnCancelIsLoading: false,
      btnSaveIsLoading: false,
    })
  }

  /**
   * 删除文件
   */
  handleCancelAddSong = () => {
    this.setState({
      btnCancelIsLoading: true
    })
    this.props.songStore.removeSongFile(this.state.cache.name).then(returns => {
      this.setState({
        btnCancelIsLoading: false
      })
      if (returns.success) {
        message.warn('已取消')
        this.reset()
        if (this.props.onCancel) {
          this.props.onCancel()
        }
      }
    })
  }

  /**
   * 新增歌曲（补充歌曲详细信息）
   */
  handleAddSong = () => {
    this.props.form.validateFields((err, field: {
      title: string,
      artist: string,
      album: string,
    }) => {
      if (!this.state.image) {
        this.setState({
          showImageSelectError: true,
        })
      }
      if (err || !this.state.image) {
        return
      }
      this.setState({
        btnSaveIsLoading: true,
      })
      const image = this.state.image
      const cache = this.state.cache
      this.props.songStore.saveToList({
        _id: void 0 as any,
        url: void 0 as any,
        name: cache.name,
        key: cache.key,
        mimeType: cache.mimeType,
        size: +cache.size,
        duration: +cache.duration,
        title: field.title,
        artist: field.artist,
        album: field.album,
        image,
      }).then(returns => {
        this.setState({
          btnSaveIsLoading: false,
        })
        if (returns.success) {
          message.success('添加成功')
          this.reset()
          if (this.props.onSuccess) {
            this.props.onSuccess(returns.data)
          }
        }
      })
    })
  }



  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator

    const image = this.state.image ?
      (
        <div
          className={s.formImage}
          style={
            this.state.image ? { backgroundImage: `url(${this.state.image.thumb})` } : {}
          }
        />
      ) : (
        <Icon
          type="picture"
          className={s.iconLarge}
        >
          点击选择歌曲封面
        </Icon>
      )
    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col
            span={12}
          >
            <Modal
              title="选择歌曲封面"
              width={'80%'}
              closable={false}
              visible={this.state.selectImageModalVisible}
              onCancel={this.handleCloseSelectImageModal}
              onOk={this.handleOKSelectImageModal}
              okText="确定"
              cancelText="取消"
            >
              <ImagesComponent
                imageType={ImageType.Music}
                image={void 0 as any}
                mode="select"
                onSelect={this.handleSelectImage}
                selectImage={this.state.image}
              />
            </Modal>
            <div
              className={`${s.formImageBox} ${this.state.showImageSelectError ? s.error : ''}`}
              onClick={() => { this.handleShowSelectImageModal() }}
            >
              {
                image
              }
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
                    initialValue: this.state.cache.title
                  })(
                  <Input
                    placeholder="歌曲名称"
                    autoComplete="off"
                    onChange={this.createHandelChangeSaveToLocal('title')}
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
                    initialValue: this.state.cache.artist
                  })(
                  <Input
                    placeholder="歌手名称"
                    autoComplete="off"
                    onChange={this.createHandelChangeSaveToLocal('artist')}
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
                    initialValue: this.state.cache.album
                  })(
                  <Input
                    placeholder="专辑名称"
                    autoComplete="off"
                    onChange={this.createHandelChangeSaveToLocal('album')}
                  />
                  )
              }
            </FormItem>
            <FormItem label="歌曲时长">
              <Input
                placeholder="歌曲时长"
                autoComplete="off"
                disabled
                value={parseTime(Math.round(this.state.cache.duration))}
              />
            </FormItem>
          </Col>
        </Row>
        <div className={s.formSongContent}>
          <Popconfirm
            title="将会删除上传到文件，确认是否取消？"
            onConfirm={this.handleCancelAddSong}
            okText="是"
            cancelText="否"
          >
            <Button type="danger" loading={this.state.btnCancelIsLoading}>取消</Button>
          </Popconfirm>
          <Button type="primary" loading={this.state.btnSaveIsLoading} onClick={this.handleAddSong}>确定</Button>
        </div>
      </Form >
    )
  }
}

export default Form.create()(SongFormComponent)