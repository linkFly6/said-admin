/*
 redux 围绕：actionTypes/actions/reducer 进行工作，但是拆开之后样板文件太多了
 所以这里采用 ducks 设计：https://github.com/erikras/ducks-modular-redux
*/
// import Promise from 'Promise'
// actionTypes
import { Said } from '../types'
import { Dispatch } from 'react-redux'

export const constants = {
  ADD: 'SAID/ADD',
  UPDATE: 'SAID/UPDATE',
  LOAD: 'SAID/LOAD',
  REMOVE: 'SAID/REMOVE',
}




const initialState: Said[] = [] // Article

// reducer
export default function (state: Said[] = initialState /* state 应该有一个默认值 */, action: SaidADD<Said>) {
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

export interface SaidADD<T> {
  type: typeof constants.ADD,
  payload: T,
  error: any | null,
  meta: string,
}

// actions


export const actions = {
  // 社区规范参见这里：https://github.com/acdlite/flux-standard-action
  add: (item: Said): SaidADD<Said> => ({
    type: constants.ADD,
    // 数据载体， containers 中的容器组件会 dispatch 数据到这里（也就是 item）
    payload: item,
    error: null, // error 的情况下为 true，并且 payload 为 Error 数据
    meta: '元数据，提供数据描述'
  }),

  loadSaidLists: () => {
    // 通过 redux-thunk 中间件，返回函数
    return (dispatch: Dispatch<SaidADD<Said>>) => {
      return new Promise<Said[]>((resolve: (values: Said[]) => void) => {
        window.setTimeout(
          function () {
            resolve([{
              key: 0,
              name: '测试名称1',
              context: `测试正文 - ${Date.now()}`
            },
            {
              key: 1,
              name: '测试名称2',
              context: `测试正文 - ${Date.now()}`
            }])
          },
          2000)
      }).then((datas: Said[]) => {
        datas.forEach((data) => {
          dispatch(actions.add(data))
        })
      })
    }
  }
}
