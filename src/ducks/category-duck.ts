/*
 redux 围绕：actionTypes/actions/reducer 进行工作，但是拆开之后样板文件太多了
 所以这里采用 ducks 设计：https://github.com/erikras/ducks-modular-redux
*/
// import Promise from 'Promise'
// actionTypes
import { CategoryModel } from '../types/category'

// action type
export const constants = {
  ADD: 'CATEGORY/ADD',
  UPDATE: 'CATEGORY/UPDATE',
  LOAD: 'CATEGORY/LOAD',
  FIND: 'CATEGORY/FIND',
  REMOVE: 'CATEGORY/REMOVE',
}

// actions
export interface ActionAdd<T> {
  type: typeof constants.ADD,
  payload: T,
  error: boolean | null,
  meta: string,
}


export interface ActionEdit<T> {
  type: typeof constants.UPDATE,
  payload: T,
  error: boolean | null,
  meta: string,
}


export interface DispatchProps {
  add(item: CategoryModel): ActionAdd<CategoryModel>
  edit(id: string, item: CategoryModel): ActionAdd<CategoryModel>
}

export const actions: DispatchProps = {
  // 社区规范参见这里：https://github.com/acdlite/flux-standard-action
  add: (item: CategoryModel): ActionAdd<CategoryModel> => ({
    type: constants.ADD,
    // 数据载体， containers 中的容器组件会 dispatch 数据到这里（也就是 item）
    payload: item,
    error: false, // error 的情况下为 true，并且 payload 为 Error 数据
    meta: 'meta'
  }),

  edit: (id: string, item: CategoryModel): ActionEdit<CategoryModel> => ({
    type: constants.UPDATE,
    // 数据载体， containers 中的容器组件会 dispatch 数据到这里（也就是 item）
    payload: item,
    error: false, // error 的情况下为 true，并且 payload 为 Error 数据
    meta: 'meta'
  }),
}



const initialState: CategoryModel[] = [] // Article

// reducer = 处理数据
export default function (
  state: CategoryModel[] = initialState,
  action: ActionAdd<CategoryModel> | ActionEdit<CategoryModel>) {
  switch (action.type) {
    case constants.ADD: {
      return [
        ...state,
        action.payload
      ]
    }
    case constants.UPDATE:
      return state.map(item => {
        if (item._id === (action as ActionEdit<CategoryModel>).payload._id) {
          return action.payload
        }
        return item
      })
    case constants.LOAD:
      break
    case constants.REMOVE:
      break
    default:
      break
  }
  return state
}






