import { observable, computed, observe, runInAction } from 'mobx'
import { ImageType } from '../types/image'
import { AdminRule } from '../types/admin'
import { fetch, post } from '../service/http'
import { ArticleModel } from '../types/article'

/**
 * 文章类
 */
export class Article {
  _id: string
  title: string
  context: string
  key: string
  author: {
    _id?: string,
    nickName: string,
    avatar?: string,
    email?: string,
    bio?: string,
    rule: AdminRule
  }
  summary: string
  poster: {
    _id: string
    size: number
    fileName: string
    type: ImageType
    name: string
    key: string
  }
  song: {
    _id: string
    key: string
    title: string
    mimeType: string
    size: number
    artist: string
    album: string
    duration: number
    image: {
      _id: string
      size: number
      fileName: string
      type: ImageType
      name: string
      key: string
    }
  }
  other: {
    xml: string
    html: string
    summaryHTML: string
  }
  info: {
    likeCount: number
    createTime: number
    updateTime: number
  }
  config: any
}

export class ArticleStore {
  @observable articles: Article[] = []

  /**
   * 查询文章 新增/编辑页面需要的基础数据
   * 如果有参数 articleId，则为新增模式查询
   * 如果没有参数 articleId，则为编辑模式查询（会查询得到要编辑的 Blog 对象）
   * @param articleId 
   */
  queryBlogBaseInfo(articleId: string) {
    return fetch<{
      article: ArticleModel
    }>('/back/api/user/article/base', { articleId })
  }

  /**
   * 加载文章列表
   */
  load() {
    return fetch<Article[]>('/back/api/user/article/query').then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.articles = returns.data
        })
      }
      return returns
    })
  }

  /**
   * 新增/编辑文章
   * @param article
   */
  save(article: {
    _id?: string,
    title: string,
    summary: string,
    context: string,
    songId: string,
    posterId: string,
  }) {
    return post<Article>(
      article._id ?
        '/back/api/user/article/update' :
        '/back/api/user/article/create'
      , {
        entity: article,
      }).then(returns => {
        if (returns.check()) {
          // 新增模式下把数据 push 到 store 中
          if (!article._id) {
            runInAction(() => {
              this.articles.push(returns.data as any)
            })
          }
        }
        return returns
      })
  }
  /**
   * 删除文章
   * @param articleId 
   */
  remove(articleId: string) {
    return post('/back/api/user/article/remove', { articleId }).then(returns => {
      if (returns.success) {
        runInAction(() => {
          let index = this.articles.findIndex(a => a._id === articleId)
          if (~index) {
            this.articles.splice(index, 1)
          }
        })
      }
      return returns
    })
  }
}
