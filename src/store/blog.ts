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
   * 查询 Blog 新增/编辑页面需要的基础数据
   * 如果有参数 blogId，则为新增模式查询
   * 如果没有参数 blogId，则为编辑模式查询（会查询得到要编辑的 Blog 对象）
   * @param blogId 
   */
  queryBlogBaseInfo(blogId?: string) {
    return fetch<{
      tags: TagModel[],
      categorys: CategoryModel[],
      blog?: BlogModel
    }>('/back/api/user/blog/base', blogId ? { blogId } : undefined).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.categorys = returns.data.categorys
          this.tags = returns.data.tags
        })
      }
      return returns
    })
  }

  /**
   * 加载 blog 列表
   */
  load() {
    return fetch<Blog[]>('/back/api/user/blog/query').then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.blogs = returns.data
        })
      }
      return returns
    })
  }

  /**
   * 新增 blog
   * @param blog 
   */
  save(blog: {
    _id?: string,
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
    return post<BlogModel>(
      blog._id ?
        '/back/api/user/blog/update' :
        '/back/api/user/blog/create'
      , {
        entity: blog,
      }).then(returns => {
        if (returns.check()) {
          // 新增模式下把数据 push 到 store 中
          if (!blog._id) {
            runInAction(() => {
              this.blogs.push(returns.data as any)
            })
          }
        }
        return returns
      })
  }

  /**
   * 删除 blog
   * @param blogId 
   */
  remove(blogId: string) {
    return post('/back/api/user/blog/remove', { blogId }).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          let index = this.blogs.findIndex(blog => blog._id === blogId)
          if (~index) {
            this.blogs.splice(index, 1)
          }
        })
      }
      return returns
    })
  }
}
