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
  REMOVE: 'CATEGORY/REMOVE',
}

// actions
export interface ActionAdd<T> {
  type: typeof constants.ADD,
  payload: T,
  error: boolean | null,
  meta: string,
}


export interface DispatchProps {
  add(item: CategoryModel): ActionAdd<CategoryModel>
  // loadCategoryLists(): (dispatch: any) => Promise<ActionAdd<CategoryModel>[]>
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

  // loadCategoryLists: () => {
  //   // 通过 redux-thunk 中间件，返回函数
  //   return (dispatch: Dispatch<ActionAdd<CategoryModel>>) => {
  //     return new Promise<CategoryModel[]>((resolve: (values: CategoryModel[]) => void) => {
  //       window.setTimeout(
  //         function () {
  //           resolve([{
  //             key: 0,
  //             name: '测试名称1',
  //             context: `测试正文 - ${Date.now()}`
  //           },
  //           {
  //             key: 1,
  //             name: '测试名称2',
  //             context: `测试正文 - ${Date.now()}`
  //           }])
  //         },
  //         2000)
  //     }).then((datas: CategoryModel[]) => {
  //       return datas.map((data) => {
  //         return dispatch(actions.add(data))
  //       })
  //     })
  //   }
  // }
}



const initialState: CategoryModel[] = [] // Article

// reducer = 处理数据
export default function (state: CategoryModel[] = initialState /* state 应该有一个默认值 */, action: ActionAdd<CategoryModel>) {
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






