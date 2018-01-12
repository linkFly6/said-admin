import { observable, computed, observe, action, runInAction } from 'mobx'
import { CategoryModel } from '../types/category'
import { fetch, post } from '../service/http'
import { targetDiffInObj } from '../service/utils'
import { Returns } from '../models/returns'



export class CategoryStore {
  @observable categorys: CategoryModel[] = []

  /**
   * 加载列表
   */
  load() {
    return fetch<CategoryModel[]>('/back/api/user/category/query').then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.categorys = returns.data
        })
      }
      return returns
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