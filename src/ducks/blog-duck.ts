import { BlogModel } from '../types/blog'
import { Dispatch, DispatchProp } from 'react-redux'


// action type
export const constants = {
  ADD: 'BLOG/ADD',
  UPDATE: 'BLOG/UPDATE',
  LOAD: 'BLOG/LOAD',
  REMOVE: 'BLOG/REMOVE',
}


// actions
export interface ActionAdd<T> {
  type: typeof constants.ADD,
  payload: T,
  error: boolean | null,
  meta: string,
}


export interface DispatchProps {
  add(item: BlogModel): ActionAdd<BlogModel>
  loadBlogLists(): (dispatch: any) => Promise<ActionAdd<BlogModel>[]>
}

export const actions: DispatchProps = {
  // 社区规范参见这里：https://github.com/acdlite/flux-standard-action
  add: (item: BlogModel): ActionAdd<BlogModel> => ({
    type: constants.ADD,
    // 数据载体， containers 中的容器组件会 dispatch 数据到这里（也就是 item）
    payload: item,
    error: false, // error 的情况下为 true，并且 payload 为 Error 数据
    meta: '元数据，提供数据描述'
  }),

  loadBlogLists: () => {
    // 通过 redux-thunk 中间件，返回函数
    return (dispatch: Dispatch<ActionAdd<BlogModel>>) => {
      return new Promise<BlogModel[]>((resolve: (values: BlogModel[]) => void) => {
        window.setTimeout(
          function () {
            resolve([])
          },
          2000)
      }).then((datas: BlogModel[]) => {
        return datas.map((data) => {
          return dispatch(actions.add(data))
        })
      })
    }
  }
}



const initialState: BlogModel[] = [] // Article

// reducer = 处理数据
export default function (state: BlogModel[] = initialState, action: ActionAdd<BlogModel>) {
  switch (action.type) {
    case constants.ADD: {
      return [
        ...state,
        action.payload
      ]
    }
    case constants.UPDATE:
      break
    case constants.LOAD:
      break
    case constants.REMOVE:
      break
    default:
      break
  }
  return state
}