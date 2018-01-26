import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Row, Col, Table, Icon, Popconfirm, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './index.styl'
import { inject, observer } from 'mobx-react'
import { BlogStore } from '../../store/blog'
import { userReady } from '../../service/user'
import { BlogModel } from '../../types/blog'
import history from '../../assets/js/history'
import { List } from 'immutable'
import * as moment from 'moment'

export interface StateProps {
  blog: BlogStore
}

@inject((allStores: any) => ({
  blog: allStores.store.blog
}))
@observer
class Index extends React.Component<StateProps, { deleteList: List<string> }> {

  state = {
    deleteList: List<string>()
  }

  /**
   * constructor 中不允许操作 state
   */
  componentWillMount() {
    this.load()
  }

  /**
   * 远程加载数据
   */
  async load() {
    const loginValue = await userReady()
    if (loginValue) return
    this.props.blog.load()
  }
  handelRemoveEditBlog = (blogId) => {
    history.push(`/blog/edit/${blogId}`)
  }
  handelRemoveBlog = (blogId: string) => {
    this.setState({
      deleteList: this.state.deleteList.push(blogId)
    })
    this.props.blog.remove(blogId).then(returns => {
      let index = this.state.deleteList.indexOf(blogId)
      if (~index) {
        this.setState({
          deleteList: this.state.deleteList.remove(index)
        })
      }
      if (returns.success) {
        message.success('删除成功!')
      }
    })
  }
  render() {
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
      dataIndex: 'comments.length',
      key: 'comments',
    }, {
      title: '更新时间',
      dataIndex: 'info.updateTime',
      key: 'updateTime',
      render(updateTime: number) {
        return moment(updateTime).format('YYYY-MM-DD HH:mm:ss')
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, blog: BlogModel) => (
        <span>
          <Button
            icon="edit"
            type="primary"
            style={{ marginRight: '1rem' }}
            onClick={() => this.handelRemoveEditBlog(blog._id)}
          />
          {
            this.state.deleteList.contains(blog._id) ?
              <Button icon="delete" type="danger" loading /> :
              <Popconfirm title="确定是否删除?" onConfirm={() => this.handelRemoveBlog(blog._id)}>
                <Button icon="delete" type="danger" />
              </Popconfirm>
          }
        </span>
      )
    }]
    return (
      <div className={`${s.view} ${s.blogIndex}`}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={this.props.blog.blogs.slice()}
        />
      </div >
    )
  }
}

export default Index
