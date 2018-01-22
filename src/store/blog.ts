import { observable, computed, observe, runInAction } from 'mobx'
import { fetch, post } from '../service/http'
import { TagModel } from '../types/tag'
import { CategoryModel } from '../types/category'
import { BlogModel } from '../types/blog'


export class Blog {
  _id: string = ''
  title: string = ''
  urlKey: string = ''
  author: string = ''
  summary: string = ''
  fileName: string = ''
  tags: string = ''
  category: string = ''
  config = {
    isPrivate: false,
    isReprint: false,
    script: '',
    css: '',
    password: '',
  }
}

export class BlogStore {
  @observable blogs: Blog[] = []
  @observable categorys: CategoryModel[] = []
  @observable tags: TagModel[] = []

  /**
   * 新增 blog 需要查询的基础数据信息
   */
  queryCreateBlogBaseInfo() {
    return fetch<{ tags: TagModel[], categorys: CategoryModel[] }>('/back/api/user/blog/base').then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.categorys = returns.data.categorys
          this.tags = returns.data.tags
        })
      }
      return returns
    })
  }

  create(blog: {
    title: string,
    summary: string,
    context: string,
    tags: string[],
    category: string,
    config: {
      css: string | void,
      script: string | void,
    }
  }) {
    return post<BlogModel>('/back/api/user/blog/create', {
      entity: blog,
    }).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.blogs.push(returns.data as any)
        })
      }
      return returns
    })
  }
}
