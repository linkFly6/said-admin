import * as React from 'react'
import { Popover, Button, Card, Icon, Upload, Modal, message, Progress } from 'antd'
import * as s from './images.styl'
import { ImageModel, ImageType } from '../../types/image'
import { UploadChangeParam } from 'antd/lib/upload'
import { ImageStore } from '../../store/image'

interface StateProp {
  image: ImageStore,
  imageType: ImageType,
  token: string,
}


const UploadProgress = (props: {
  isUploading: boolean,
  percent: number,
}) => {
  if (props.isUploading) {
    return (
      <Progress type="circle" percent={props.percent} />
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
  handleClickPreview: (image: ImageModel) => void,
  handleClickDelete: (image: ImageModel) => void
}) => {
  return (
    <div className={s.cardGrid}>
      <div className={s.card}>
        <div className={s.image}>
          <img src={props.iamge.fileName} />
        </div>
        <div className={s.buttons}>
          <span>
            <Icon type="eye-o" style={{ color: '#fff' }} onClick={() => props.handleClickPreview(props.iamge)} />
            <Icon type="delete" style={{ color: '#fff' }} onClick={() => props.handleClickDelete(props.iamge)} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default class ImageComponents extends React.Component<StateProp, {
  uploading: boolean,
  percent: number,
  imageList: ImageModel[],
  previewVisible: boolean,
  previewImage: ImageModel | null,
}> {
  state = {
    // 是否正在上传
    uploading: false,
    // 上传进度
    percent: 0,
    imageList: [],
    previewVisible: false,
    previewImage: null,
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
      uploading: true
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
    this.props.image.upload({
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
        }
      })
  }

  /**
   * 上传前附加数据
   */
  handleUploaderMixinData = (file: File) => {
    return { imageType: this.props.imageType, token: this.props.token }
  }
  // 删除图片
  handleClickDeleteImage = (image: ImageModel) => {
    console.log(image)
  }
  // 预览图片
  hanleClickPreviewImage = (image: ImageModel) => this.setState({ previewImage: image, previewVisible: true })
  // 关闭预览图片
  handlePreviewModalClose = () => this.setState({ previewVisible: false, previewImage: null })
  render() {
    return (
      <div className={s.imageComponents}>
        <div className={s.imageCardBox}>
          <div className={s.uploadGrid}>
            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handlePreviewModalClose}>
              <img
                alt="preview"
                style={{ width: '100%' }}
                src={this.state.previewImage ? (this.state.previewImage as any).fileName : void 0}
              />
            </Modal>
            <Upload
              name="img"
              accept="image/gif,image/jpeg,image/png"
              customRequest={this.handleRequest}
              listType="picture-card"
              showUploadList={false}
              data={this.handleUploaderMixinData}
              action="/back/api/user/image/upload"
            >
              <UploadProgress percent={this.state.percent} isUploading={this.state.uploading} />
            </Upload>
          </div>
          {
            this.state.imageList.map((image: ImageModel) =>
              <ImageGrid
                key={image._id}
                iamge={image}
                handleClickDelete={this.hanleClickPreviewImage}
                handleClickPreview={this.hanleClickPreviewImage}
              />
            )
          }
        </div>
      </div>
    )
  }
}