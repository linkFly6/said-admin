import * as React from 'react'
import { Card, Layout, message } from 'antd'
import * as s from './index.styl'

interface StateProps {
}

interface PrevState {
  images: string[]
}

interface EventTarget1 {
  target: {
    result: string
  }
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
    if (!fileList[0].type.includes('image')) {
      message.error('拖图片！')
    }
    const previewList = [] as string[]
    const reader = new FileReader()
    reader.readAsDataURL(fileList[0])
    reader.onload = (event) => {
      const target = event.target as any
      previewList.push(target.result)
      this.setState((prevState: PrevState) => ({images: [...prevState.images, ...previewList]}))
    }
    e.stopPropagation()
    e.preventDefault()
    return false
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
