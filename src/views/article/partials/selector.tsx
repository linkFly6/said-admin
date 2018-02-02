import * as React from 'react'
import * as s from '../edit.styl'
import { ImageModel, ImageType } from '../../../types/image'
import { Icon, Modal, message } from 'antd'
import { ImageComponent } from '../../../components/images/images'
import { SongGrid } from '../../../components/songs/song-grid'
import { SongModel } from '../../../types/song'
import { SongComponent } from '../../../components/songs/song'

interface SelectorStateProps<T> {
  onSelect: (model: T) => void
  initSelectModel?: T | null
  showerror?: boolean
}
interface SelectorComponentState<T> {
  /**
   * 是否显示弹出框
   */
  visibleModal: boolean,
  /**
   * 正在使用的专辑封面图
   */
  model: T | null,

  /**
   * 选择中的专辑封面图
   */
  selectModel: T | null,

  /**
   * 是否显示错误
   */
  showerror: boolean
}

/**
 * 文章图片选择组件
 */
export class SelectorImage extends React.Component<SelectorStateProps<ImageModel>, SelectorComponentState<ImageModel>> {
  state: SelectorComponentState<ImageModel> = {
    visibleModal: false,
    model: null,
    selectModel: null,
    showerror: false,
  }

  componentWillMount() {
    this.init(this.props.initSelectModel)
  }

  componentWillReceiveProps(nextProp: SelectorStateProps<ImageModel>) {
    if (nextProp.showerror != null) {
      this.setState({
        showerror: nextProp.showerror,
      })
    }
    this.init(nextProp.initSelectModel)
  }

  init(model: ImageModel | null | void) {
    // 如果自己状态存储的 model 不存在，或者 model 不为空并且已经产生了改变
    // 就把外面传递进来的 model 设入状态
    if (!this.state.model || (model && model._id !== this.state.model._id)) {
      this.setState({
        model: model || null,
      })
    }
  }
  /**
   * 关闭或取消选择图片
   */
  handleCloseSelectImageModal = () => {
    this.setState({
      visibleModal: false,
      // 如果有选择的图片则不显示错误，否则显示错误
      showerror: !this.state.model
    })
  }
  /**
   * 确认选择图片，选择图片的容器点击确定之后
   */
  handleOKSelectImageModal = () => {
    if (!this.state.selectModel) {
      message.error('请选择文章图片(-10000)')
      return
    }
    // this.setStore('image', this.state.selectImage)
    this.setState({
      visibleModal: false,
      model: this.state.selectModel,
      // 清空掉选择的图片
      selectModel: null,
    })
    this.props.onSelect(this.state.selectModel)
  }
  /**
   * 选择图片（注意，不是确认选择，而是每进行一次选择动作都会进行触发的事件）
   */
  handleSelectImage = (image: ImageModel) => {
    this.setState({
      selectModel: image,
    })
  }
  render() {
    return (
      <div
        className={
          [s.selector,
          s.selectImage,
          this.state.model ? s.zoom : '',
          this.state.showerror ? s.error : ''
          ].join(' ')
        }
      >
        <div className={s.selectMask} onClick={() => this.setState({ visibleModal: true })}>
          <Icon type="picture">
            点击选择图片
          </Icon>
        </div>
        <div
          className={s.articleImage}
          style={
            this.state.model ? { backgroundImage: `url(${this.state.model.thumb})` } : {}
          }
        />
        <Modal
          title="选择文章图片"
          width={'80%'}
          closable={false}
          visible={this.state.visibleModal}
          onCancel={this.handleCloseSelectImageModal}
          onOk={this.handleOKSelectImageModal}
          okText="确定"
          cancelText="取消"
        >
          <ImageComponent
            imageType={ImageType.Article}
            image={void 0 as any}
            mode="select"
            onSelect={this.handleSelectImage}
            selectImage={this.state.model}
          />
        </Modal>
      </div>
    )
  }
}


/**
 * 选择歌曲组件
 */
export class SelectorSong extends React.Component<SelectorStateProps<SongModel>, SelectorComponentState<SongModel>> {
  state: SelectorComponentState<SongModel> = {
    visibleModal: false,
    model: null,
    selectModel: null,
    showerror: false,
  }

  componentWillMount() {
    this.init(this.props.initSelectModel)
  }

  componentWillReceiveProps(nextProp: SelectorStateProps<SongModel>) {
    if (nextProp.showerror != null) {
      this.setState({
        showerror: nextProp.showerror,
      })
    }
    this.init(nextProp.initSelectModel)
  }

  init(model: SongModel | null | void) {
    // 如果自己状态存储的 model 不存在，或者 model 不为空并且已经产生了改变
    // 就把外面传递进来的 model 设入状态
    if (!this.state.model || (model && model._id !== this.state.model._id)) {
      this.setState({
        model: model || null,
      })
    }
  }

  /**
   * 关闭或取消选择歌曲
   */
  handleCloseSelectModal = () => {
    this.setState({
      visibleModal: false,
      // 如果有选择的歌曲则不显示错误，否则显示错误
      showerror: !this.state.model
    })
  }
  /**
   * 确认选择歌曲，选择歌曲的容器点击确定之后
   */
  handleOKSelectModal = () => {
    if (!this.state.selectModel) {
      message.error('请选择音乐(-10000)')
      return
    }
    // this.setStore('image', this.state.selectImage)
    this.setState({
      visibleModal: false,
      model: this.state.selectModel,
      // 清空掉选择的歌曲
      selectModel: null,
    })
    this.props.onSelect(this.state.selectModel)
  }
  /**
   * 选择歌曲（注意，不是确认选择，而是每进行一次选择动作都会进行触发的事件）
   */
  handleSelectSong = (song: SongModel) => {
    this.setState({
      selectModel: song,
    })
  }

  render() {
    return (
      <div
        className={
          [s.selector,
          s.selectSong,
          this.state.model ? s.zoom : '',
          this.state.showerror ? s.error : ''
          ].join(' ')
        }
      >
        <div className={s.selectMask} onClick={() => this.setState({ visibleModal: true })}>
          <Icon type="picture">
            点击选择歌曲
          </Icon>
        </div>
        {
          this.state.model ?
            (
              <SongGrid
                mode="select"
                isPlay={false}
                isShowDelete={false}
                song={this.state.model}
              />
            ) : null
        }
        <Modal
          title="选择文章图片"
          width={'80%'}
          closable={false}
          visible={this.state.visibleModal}
          onCancel={this.handleCloseSelectModal}
          onOk={this.handleOKSelectModal}
          okText="确定"
          cancelText="取消"
        >
          <SongComponent
            mode="select"
            onSelect={this.handleSelectSong}
            selectSong={this.state.model}
            songStore={undefined as any}
            adminStore={undefined as any}
          />
        </Modal>
      </div>
    )
  }
}