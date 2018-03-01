import { observable, computed, observe, action, runInAction } from 'mobx'
import { CategoryModel } from '../types/category'
import { fetch, post } from '../service/http'
import { targetDiffInObj } from '../service/utils'
import { Returns } from '../models/returns'


/**
 * 服务端返回的 icon 列表
 * defaults 是默认 icon
 * icons 是所有 icon 列表，包含 defaults
 */
export interface Icons {
  defaults: string,
  icons: string[]
}

export class CategoryStore {
  @observable categorys: CategoryModel[] = []
  /**
   * 默认 icon
   */
  @observable defaultIcon: string = ''
  /**
   * icon 列表
   */
  @observable icons: string[] = []
  /**
   * 加载列表
   */
  load() {
    return fetch<{ categorys: CategoryModel[], icons: Icons }>('/back/api/user/category/base').then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.categorys = returns.data.categorys
          this.defaultIcon = returns.data.icons.defaults
          this.icons = returns.data.icons.icons
        })
      }
      return returns
    })
  }

  /**
   * 查看是否有同名的分类名称
   * @param categoryName 
   */
  exists(categoryName: string, id?: string) {
    return this.categorys.some(category => {
      return category.name === categoryName.trim() && id !== category._id
    })
  }

  /**
   * 新增
   * @param category 
   */
  create(category: { name: string, icon: string }) {
    return post<CategoryModel>('/back/api/user/category/create', {
      entity: category,
    }).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.categorys.unshift(returns.data)
        })
      }
      return returns
    })
  }

  /**
   * 编辑
   * @param category 
   */
  updateById(id: string, category: { name?: string, icon?: string, }) {
    let oldCategoryIndex = this.categorys.findIndex((c) => c._id === id)
    if (~oldCategoryIndex) {
      let oldCategory = this.categorys[oldCategoryIndex]
      this.categorys.splice(oldCategoryIndex, 1, {
        _id: id,
        name: category.name || oldCategory.name,
        icon: category.icon || oldCategory.icon,
      })
      // 两个对象相等(没有修改)，则直接返回
      if (targetDiffInObj(category, oldCategory)) {
        return Promise.resolve(new Returns({
          code: 0,
          message: '对象没有修改',
          data: null
        }))
      }
      return post<CategoryModel>('/back/api/user/category/update', {
        entity: {
          id,
          ...category
        },
      })
      // .then(returns => {
      // if (returns.check()) {
      //   runInAction(() => {
      //     this.categorys.unshift(returns.data)
      //   })
      // }
      // return returns
      // })
    } else {
      return Promise.resolve(new Returns({
        code: -1,
        message: '未找到编辑项',
        data: null
      }))
    }
  }

  /**
   * 删除
   * @param id 
   */
  remove(id: string) {
    let oldCategoryIndex = this.categorys.findIndex((c) => c._id === id)
    if (~oldCategoryIndex) {
      let oldCategory = this.categorys[oldCategoryIndex]
      this.categorys.splice(oldCategoryIndex, 1)
      return post<CategoryModel>('/back/api/user/category/remove', { id })
    } else {
      return Promise.resolve(new Returns({
        code: -1,
        message: '未找到删除项',
        data: null
      }))
    }
  }
}