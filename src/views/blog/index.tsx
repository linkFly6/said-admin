import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Row, Col, Table, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './index.styl'



const columns = [{
  title: '标题',
  dataIndex: 'title',
  key: 'title',
}, {
  title: '分类',
  dataIndex: 'category.name',
  key: 'category',
}, {
  title: '喜欢',
  dataIndex: 'info.likeCount',
  key: 'likeCount',
}, {
  title: '评论',
  dataIndex: 'info.commentCount',
  key: 'likeCount',
}, {
  title: '更新时间',
  dataIndex: 'info.updateTime',
  key: 'updateTime',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Icon type="edit" />
      <Icon type="delete" />
    </span>
  )
}]

export interface StateProps { }


class Index extends React.Component<FormComponentProps & StateProps> {
  render() {
    return (
      <div className={`${s.view} ${s.blogIndex}`}>
        <Table columns={columns} />
      </div >
    )
  }
}

export default Index
