import * as React from 'react'
import { Card, Layout, message } from 'antd'
import * as s from './index.styl'

interface StateProps {
}

interface PrevState {
  images: string[]
}

export default class ImageManager extends React.Component<StateProps> {
  state = {
    images: ['http://t2.hddhhn.com/uploads/tu/201607/176/efqomc0rcmu.jpg']
  }

  componentDidMount() {
    document.addEventListener('dragover', this.handleDragOver)
  }

  handleDropdown = e => {
    const fileList = e.dataTransfer.files
    if (fileList.length === 0) {
      return
    }
    this.previewImages(fileList)
    e.stopPropagation()
    e.preventDefault()
    return false
  }

  previewImages = files => {
    Array.from(files as any[]).filter(file => file.type.includes('image')).forEach(img => {
      const reader = new FileReader()
      reader.readAsDataURL(img)
      reader.onload = e => {
        const target = e.target as any
        const { result } = target
        this.setState((prevState: PrevState) => ({images: [...prevState.images, result]}) )
      }
    })
  }

  handleDragOver = e => {
    document.addEventListener('drop', this.handleDropdown)
    this.setState({ showDragOverModal: true })
    e.stopPropagation()
    e.preventDefault()
    return false
  }

  renderImageList = () => {
    const { images } = this.state
    return images.map((i, index) => (
      <Card.Grid className={s.cardGrid} key={index}>
        <div className={s.gridImage}>
          <img src={i} alt={i} />
        </div>
      </Card.Grid>
    ))
  }

  render() {
    return (
      <Layout>
        <Card hoverable={false} title="图片管理" bodyStyle={{ padding: 0 }}>
          {this.renderImageList()}
        </Card>
      </Layout>
    )
  }
}
