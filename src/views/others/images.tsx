import * as React from 'react'
import { Button, Card } from 'antd'

export interface StateProps {
}

export default class ImageManager extends React.Component<StateProps, {}> {
  render() {
    return (
      <div>
        <Card title="图片管理" noHovering>
          <Card.Grid>1</Card.Grid>
        </Card>
      </div>
    )
  }
}
