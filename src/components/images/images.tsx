import * as React from 'react'
import { Popover, Button, Card, Icon, Upload, Modal } from 'antd'
import * as s from './images.styl'
import { ImageModel, ImageType } from '../../types/image'
import { UploadChangeParam } from 'antd/lib/upload'

interface StateProp {
  imageType: ImageType,
  token: string,
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
  loading: boolean,
  imageList: ImageModel[],
  previewVisible: boolean,
  previewImage: ImageModel | null,
}> {
  state = {
    loading: false,
    imageList: [],
    previewVisible: false,
    previewImage: null,
  }

  /**
   * 上传前/上传中/上传完成
   * @param uploadParams 
   */
  handleUploaderStateChange(uploadParams: UploadChangeParam) {
    // console.log(uploadParams)
  }

  /**
   * 上传前附加数据
   */
  handleUploaderMixinData = (file: File) => {
    console.log(this.props.imageType)
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
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              onChange={this.handleUploaderStateChange}
              data={this.handleUploaderMixinData}
              action="/back/api/user/image/upload"
            >
              <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} className={s.iconUpload} />
                <div className="ant-upload-text">点击上传</div>
              </div>
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