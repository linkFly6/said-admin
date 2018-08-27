import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Table, Popconfirm, message } from 'antd'
import { inject, observer } from 'mobx-react'
import { ArticleStore } from '../../store/article'
import history from '../../assets/js/history'
import { List } from 'immutable'
import * as moment from 'moment'
import { ArticleModel } from '../../types/article'

export interface StateProps {
  articleStore: ArticleStore
}

@inject((allStores: any) => ({
  articleStore: allStores.store.article
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
    this.props.articleStore.load()
  }
  handelRemoveEditArticle = (articleId) => {
    history.push(`/article/edit/${articleId}`)
  }
  handelRemoveArticle = (articleId: string) => {
    this.setState({
      deleteList: this.state.deleteList.push(articleId)
    })
    this.props.articleStore.remove(articleId).then(returns => {
      let index = this.state.deleteList.indexOf(articleId)
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
      render(title: string, article: ArticleModel) {
        return <a href={`/said/${article.key}.html`} target="_blank">{title}</a>
      }
    }, {
      title: '作者',
      dataIndex: 'author.nickName',
      key: 'nickName',
    }, {
      title: '喜欢',
      dataIndex: 'info.likeCount',
      key: 'likeCount',
    }, {
      title: '歌曲',
      dataIndex: 'song.title',
      key: 'songTitle',
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
      render: (text, article: ArticleModel) => (
        <span>
          <Button
            icon="edit"
            type="primary"
            style={{ marginRight: '1rem' }}
            onClick={() => this.handelRemoveEditArticle(article._id)}
          />
          {
            this.state.deleteList.contains(article._id) ?
              <Button icon="delete" type="danger" loading /> :
              <Popconfirm title="确定是否删除?" onConfirm={() => this.handelRemoveArticle(article._id)}>
                <Button icon="delete" type="danger" />
              </Popconfirm>
          }
        </span>
      )
    }]
    return (
      <div>
        <Table
          rowKey="_id"
          columns={columns as any}
          dataSource={this.props.articleStore.articles.slice()}
        />
      </div >
    )
  }
}

export default Index
