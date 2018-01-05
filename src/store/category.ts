import { observable, computed, observe, action } from 'mobx'
import { CategoryModel } from '../types/category'


export class CategoryStore {
  @observable categorys: CategoryModel[] = []

  @action.bound
  add(category: CategoryModel) {
    this.categorys.push(category)
  }

  @action.bound
  edit(category: CategoryModel) {
    let oldCategoryIndex = this.categorys.findIndex((c) => c._id === category._id)
    if (~oldCategoryIndex) {
      this.categorys.splice(oldCategoryIndex, 1, category)
    } else {
      throw '未找到编辑项'
    }
  }
}