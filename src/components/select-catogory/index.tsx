import * as React from 'react'
import { Popover, Button } from 'antd'
import * as s from './index.styl'

interface StateProp {
  icon?: string
  name?: string
  changeIcon?: (src: string) => void
}


const images = [
  process.env.PUBLIC_URL + '/images/default.png',
  process.env.PUBLIC_URL + '/images/icon-CSS3.gif',
  process.env.PUBLIC_URL + '/images/icon-HTML5.gif',
  process.env.PUBLIC_URL + '/images/icon-jQuery.gif',
  process.env.PUBLIC_URL + '/images/icon-JS.gif',
  process.env.PUBLIC_URL + '/images/icon-Require.gif'
]

export default class SelectCategory extends React.Component<StateProp> {
  state = {
    visible: false,
  }
  hide = () => {
    this.setState({
      visible: false,
    })
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible })
  }

  handleImgClick = (src: string) => {
    this.handleVisibleChange(false)
    if (this.props.changeIcon) this.props.changeIcon(src)
  }
  render() {
    return (
      <Popover
        content={
          <div className={s.card}>
            {
              images.map((src) => {
                return <div className={s.iconBtn} key={src} onClick={this.handleImgClick.bind(this, src)}>
                  <img src={src} />
                </div>
              })
            }
          </div>
        }
        title="选择 icon"
        trigger="click"
        visible={this.state.visible}
        placement="bottomLeft"
        onVisibleChange={this.handleVisibleChange}
      >
        <div className={`${s.component} ${s.selectCategory}`}>
          <img src={this.props.icon} />
        </div>
      </Popover>
    )
  }
}