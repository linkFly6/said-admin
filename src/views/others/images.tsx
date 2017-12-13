import * as React from 'react'
import { Card, Icon, Modal, Upload } from 'antd'
import * as s from './index.styl'

interface StateProps {
}

interface PrevState {
  images: string[]
}

export default class ImageManager extends React.Component<StateProps> {
  state = {
    images: ['http://t2.hddhhn.com/uploads/tu/201607/176/efqomc0rcmu.jpg'],

    previewVisible: false,
    previewImage  : '',
    fileList      : [{
      uid : -1,
      size: 999,
      type: 'done',
      name: 'xxx.png',
      url : 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }]
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage  : file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
