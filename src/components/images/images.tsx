import * as React from 'react'
import { Icon, Popconfirm, Upload, Modal, message, Progress, Spin } from 'antd'
import * as s from './images.styl'
import { ImageModel, ImageType, hasImageType, acceptMimetypes } from '../../types/image'
import { UploadChangeParam } from 'antd/lib/upload'
import { ImageStore } from '../../store/image'
import { userReady } from '../../service/user'
import { inject, observer } from 'mobx-react'
import { List } from 'immutable'
import { PageLoading } from '../common'
import { copyUrl } from '../../service/utils/index'


interface StateProps {
  image: ImageStore,
  imageType: ImageType,
  /**
   * 模式，默认 "view" 是普通页面模式，支持上传和删除相关图片，点击图片会放大
   * "select" 模式只支持上传图片图片，点击图片会选中图片，且每次点击图片都会触发 onSelect 事件
   */
  mode?: 'view' | 'select',
  onSelect?: (image: ImageModel) => void,
  /**
   * "select" 模式下，默认选中的图片(ID)
   */
  selectImage?: ImageModel | null
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

const ImageGrid = (props: {
  iamge: ImageModel,
  deleteting: boolean,
  onClickPreview: (image: ImageModel) => void,
  onClickDelete: (image: ImageModel) => void,
  onClickCopy: (image: ImageModel) => void,
  /**
   * 模式，默认 "view" 是普通页面模式，支持上传和删除相关图片，点击图片会放大
   * "select" 模式只支持上传图片图片，点击图片会选中图片，且每次点击图片都会触发 onSelect 事件
   */
  mode: 'view' | 'select',
  /**
   * 是否被选择
   */
  actived?: boolean
  /**
   * 选择图片触发的事件
   */
  onSelect: (image: ImageModel) => void
}) => {
  // select 模式下不允许删除图片
  let mask: React.ReactNode = null
  if (props.mode !== 'select') {
    mask = props.deleteting ?
      (
        <div className={s.deleteBox}>
          <Spin size="large" />
          <div>删除中</div>
        </div>
      ) :
      (
        <div className={s.buttons}>
          <span>
            <Icon type="eye-o" onClick={() => props.onClickPreview(props.iamge)} title="查看大图" />
            <Icon type="link" onClick={() => props.onClickCopy(props.iamge)} title="复制链接" />
            <Popconfirm
              title="确认是否删除？"
              onConfirm={() => props.onClickDelete(props.iamge)}
              okText="是"
              cancelText="否"
            >
              <Icon type="delete" title="删除图片" />
            </Popconfirm>
          </span>
        </div>
      )
  }
  return (
    <div
      className={
        // 选择模式下要有特殊的选择样式
        `${s.cardGrid} ${props.mode === 'select' ? s.modeSelect : ''} ${props.actived ? s.actived : ''}`
      }
      onClick={() => props.onSelect(props.iamge)}
    >
      <div
        className={
          [s.card,
          props.deleteting ? s.deleteting : ''].join(' ')}
      >
        <div className={s.image} style={{ backgroundImage: `url(${props.iamge.thumb})` }}>
          {/* <img src={props.iamge.thumb} /> */}
        </div>
        {
          mask
        }
      </div>
    </div>
  )
}

interface ComponentState {
  /**
   * 上传相关
   */
  // 是否正在上传
  uploading: boolean,
  // 上传进度
  percent: number,
  /**
   * 预览相关
   */
  // 预览的 modal 是否展现
  previewVisible: boolean,
  // 被预览的对象
  previewImage: ImageModel | null,
  // 是否正在加载列表
  loadingList: boolean,
  // 正在删除的内容
  deleteList: List<string>,
  // 在选择模式下，初始默认选择的 image
  selectImage: ImageModel | null,
  // 是否有文件被拖拽进来
  drag: boolean,
}

@inject((allStores: any) => ({
  admin: allStores.store.admin,
  image: allStores.store.image,
}))
@observer
export class ImageComponent extends React.Component<StateProps, ComponentState> {
  state: ComponentState = {
    // 是否正在上传
    uploading: false,
    // 上传进度
    percent: 0,
    previewVisible: false,
    previewImage: null,
    deleteList: List<string>(),
    loadingList: false,
    selectImage: null,
    drag: false,
  }

  /**
   * constructor 中不允许操作 state
   */
  componentWillMount() {
    this.load(this.props.imageType)
  }

  /**
   * 尽量晚一点判断 props，防止 props 没有 ready
   */
  componentDidMount() {
    // 如果用 props 则对渲染性能影响太大，所以自己监听 props 再设置 state
    if (this.props.selectImage) {
      this.setState({
        selectImage: this.props.selectImage,
      })
    }
  }

  /**
   * props 改变，会触发的生命周期
   * @param nextProps 
   */
  componentWillReceiveProps(nextProps: StateProps) {
    if (this.props.imageType !== nextProps.imageType) {
      this.load(nextProps.imageType)
    }
    /**
     * 如果传入了初始默认被选择的 image，则更新这个默认值
     */
    if (nextProps.selectImage) {
      this.setState({
        selectImage: nextProps.selectImage,
      })
    }
  }

  async load(imageType: ImageType) {
    if (hasImageType(imageType)) {
      this.setState({
        loadingList: true
      })
      this.props.image.query(imageType).then(() => {
        this.setState({
          loadingList: false,
        })
      })
    }
  }

  handleRequest = (option: any) => {
    /**
     * TODO
     * 1. 动画效果：
     * 上传的时候上传框变成转圈圈，然后从右往左滑出一个新的图片框（就是新上传的图片本来就应该在的位置），里面显示上传进度
     * 上传完成后等个 1s 再显示图片
     * 
     * 2. 拖拽上传
     */
    this.setState({
      uploading: true,
      percent: 0,
    })
    // const intervalId = setInterval(() => {
    //   if (this.state.percent === 100) {
    //     clearInterval(intervalId)
    //   }
    //   this.setState({
    //     percent: this.state.percent + 10
    //   })
    // }, 1000)
    // if (1 === 1) return
    this.props.image.uploadToLists({
      imageType: this.props.imageType,
      img: option.file,
    }, {
        onProgress: (e) => {
          // 表示上传进度是否可用
          if (e.lengthComputable) {
            // loaded 表示已上传字节， total 为总数
            this.setState({
              percent: e.loaded / e.total * 100
            })
          }
        }
      }).then(returns => {
        this.setState({
          uploading: false,
          percent: 0,
        })
        if (!returns.check()) {
          message.error(`${returns.message}${returns.code == null ? '' : `(${returns.code})`}`)
        } else {
          message.success('上传成功')
        }
      })
  }

  /**
   * 上传前附加数据
   */
  // handleUploaderMixinData = (file: File) => {
  //   return { imageType: this.props.imageType, token: this.props.token }
  // }
  // 删除图片
  handleClickDeleteImage = (image: ImageModel) => {
    this.setState({
      deleteList: this.state.deleteList.push(image._id),
    })
    this.props.image.deleteImageToList(image._id).then(returns => {
      if (returns.success) {
        const index = this.state.deleteList.indexOf(image._id)
        this.setState({
          deleteList: this.state.deleteList.remove(index),
        })
        message.success('删除成功')
      }
    })
  }
  // 预览图片
  hanleClickPreviewImage = (image: ImageModel) => this.setState({ previewImage: image, previewVisible: true })
  // 关闭预览图片
  handlePreviewModalClose = () => this.setState({ previewVisible: false })

  /**
   * copy 图片地址
   */
  handleClickCopy = (image: ImageModel) => {
    copyUrl(image.url)
    message.success(`成功复制图片地址`)
  }

  // 拖拽
  handleShowDragger = (e: React.DragEvent<HTMLDivElement>) => {
    this.setState({ drag: true })
    e.preventDefault()
  }
  handleHiddenDragger = (e: React.DragEvent<HTMLDivElement>) => {
    this.setState({ drag: false })
    e.preventDefault()
  }

  /**
   * 选择图片
   */
  handleSelectImage = (image: ImageModel) => {
    if (this.props.mode === 'select') {
      this.setState({
        selectImage: image
      })
      if (this.props.onSelect) {
        this.props.onSelect(image)
      }
    }
  }

  render() {
    if (this.state.loadingList) {
      return <PageLoading />
    }
    return (
      <div
        className={s.imageComponents}
        onDragEnter={this.handleShowDragger}
        onDrop={this.handleHiddenDragger}
      // 和 Upload.Dragger 冲突了，这里没办法再处理了
      // onDragLeave={(e: any) => this.eventlog('leave', e)}
      >
        <div className={s.dropBox} style={{ display: this.state.drag ? 'block' : 'none' }}>
          <Upload.Dragger
            name="img"
            accept={acceptMimetypes.join(',')}
            showUploadList={false}
            customRequest={this.handleRequest}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">拖拽文件上传</p>
          </Upload.Dragger>
        </div>
        <div className={s.imageCardBox}>
          <div className={s.uploadGrid}>
            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handlePreviewModalClose}>
              <img
                alt="preview"
                style={{ width: '100%' }}
                src={this.state.previewImage ? (this.state.previewImage as any).url : void 0}
              />
            </Modal>
            <Upload
              name="img"
              accept={acceptMimetypes.join(',')}
              customRequest={this.handleRequest}
              listType="picture-card"
              showUploadList={false}
              disabled={this.state.uploading}
            // data={this.handleUploaderMixinData}
            >
              <UploadProgress percent={this.state.percent} isUploading={this.state.uploading} />
            </Upload>
          </div>
          {
            this.props.image.images.map((image: ImageModel) =>
              <ImageGrid
                key={image._id}
                iamge={image}
                deleteting={this.state.deleteList.contains(image._id)}
                onClickDelete={this.handleClickDeleteImage}
                onClickPreview={this.hanleClickPreviewImage}
                onClickCopy={this.handleClickCopy}
                onSelect={this.handleSelectImage}
                mode={this.props.mode || 'view'}
                actived={this.state.selectImage ? this.state.selectImage._id === image._id : false}
              />
            )
          }
        </div>
      </div>
    )
  }
}