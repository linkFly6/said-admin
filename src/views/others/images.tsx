import * as React from 'react'
import { Card, Layout } from 'antd'
import * as s from './index.styl'

export interface StateProps {
}

export default class ImageManager extends React.Component<StateProps> {
  render() {
    return (
      <Layout>
        <Card noHovering title="图片管理" bodyStyle={{ padding: 0 }}>
          <Card.Grid className={s.cardGrid}>
            <div className={s.gridImage}>
              <img src="http://t2.hddhhn.com/uploads/tu/201607/176/efqomc0rcmu.jpg" />
            </div>
            <div>
              <h3>name: 冰山</h3>
              <p><a href="http://t2.hddhhn.com/uploads/tu/201607/176/efqomc0rcmu.jpg">url</a></p>
            </div>
          </Card.Grid>
        </Card>
      </Layout>
    )
  }
}
