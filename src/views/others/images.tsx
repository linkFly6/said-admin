import * as React from 'react'
import { Card, Collapse, Icon, Modal, Upload } from 'antd'
import * as s from './index.styl'
import { inject, observer } from 'mobx-react'


interface StateProps {
  img: {
    src: string,
    name: string
  },
  showPreview: () => never
}

interface PrevState {
  images: string[]
}

const { Panel } = Collapse

/*export default class ImageManager extends React.Component<StateProps> {
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
}*/

class Grid extends React.Component<StateProps> {
  handlePreview = e => {
    const { img: { src }, showPreview } = this.props as any
    showPreview({
      previewVisible: true,
      previewImage: src
    })
  }

  render() {
    const { img: { src, name } } = this.props as any
    return (
      <Card.Grid className={s.cardGrid}>
        <div className={s.gridImage}>
          <img src={src} alt={name} />
        </div>
        <div className={s.gridMask}>
          <span className={s.gridIcons}>
            <Icon type="eye-o" style={{ color: '#fff' }} onClick={this.handlePreview} />
            &nbsp;&nbsp;
          <Icon type="delete" style={{ color: '#fff' }} onClick={this.handlePreview} />
          </span>
        </div>
      </Card.Grid>
    )
  }
}

@observer
@inject('store')
export default class ImageManager extends React.Component<StateProps> {
  state = {
    imageList: [],
    previewVisible: false,
    previewImage: ''
  }

  componentDidMount() {
    this.setState({
      imageList: [{
        src: 'http://t2.hddhhn.com/uploads/tu/201607/176/efqomc0rcmu.jpg',
        name: '404'
      }, {
        src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        name: 'tea'
      }]
    })
  }

  render() {
    const { imageList, previewVisible, previewImage } = this.state
    const uploadButton = (
      <div className={s.upload}>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div>
        <Collapse activeKey={['1', '2', '3', '4']}>
          <Panel header="生活" key="1">
            <Card style={{ padding: 0 }}>
              {
                imageList.map((i: { src: string, name: string }) =>
                  <Grid key={Math.random()} img={i} showPreview={this.setState.bind(this)} />
                )
              }
              <Card.Grid className={s.cardGrid}>
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="//jsonplaceholder.typicode.com/posts/"
                >
                  {uploadButton}
                </Upload>
              </Card.Grid>
            </Card>
          </Panel>
          <Panel header="生活" key="2">11</Panel>
          <Panel header="生活" key="3">11</Panel>
          <Panel header="生活" key="4">11</Panel>
        </Collapse>
        <Modal visible={previewVisible} footer={null} onCancel={() => { this.setState({ previewVisible: false }) }}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
