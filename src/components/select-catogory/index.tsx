import * as React from 'react'
import { Popover, Button } from 'antd'
import * as s from './index.styl'

interface StateProp {
  /**
   * 当前选中的 icon
   */
  icon?: string
  /**
   * icon 列表
   */
  icons: string[]
  
  name?: string
  disabled?: boolean
  changeIcon?: (src: string) => void,
}

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
    if (this.props.disabled) {
      return (
        <div className={`${s.component} ${s.selectCategory}`}>
          <img src={this.props.icon} />
        </div>
      )
    }
    return (
      <Popover
        content={
          <div className={s.card}>
            {
              this.props.icons.map((src) => {
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
        <div className={`${s.component} ${s.selectCategory} ${s.touch}`}>
          <img src={this.props.icon} />
        </div>
      </Popover>
    )
  }
}