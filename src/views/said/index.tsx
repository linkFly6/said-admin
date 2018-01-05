import * as React from 'react'
import { Table, Button } from 'antd'
import { SaidDemoModel } from '../../types/article'
import { inject, observer } from 'mobx-react'

export interface StateProps {
  articles: SaidDemoModel[]
}

// 无状态组件用这种方式绑定
export default inject('store')(observer(function ({ articles }: StateProps) {
  const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '文本',
    dataIndex: 'context',
    key: 'context'
  }]
  return (
    <div>
      <Table
        // bordered
        title={() => <Button className="editable-add-btn">添加测试</Button>}
        columns={columns}
        // 这个 articles 是 redux 传过来的
        dataSource={articles}
      // onChange={handleChange}
      />
    </div>
  )
}))