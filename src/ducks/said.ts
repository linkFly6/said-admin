/*
 redux 围绕：actionTypes/actions/reducer 进行工作，但是拆开之后样板文件太多了
 所以这里采用 ducks 设计：https://github.com/erikras/ducks-modular-redux
*/
// import Promise from 'Promise'
// actionTypes
import { SaidModel } from '../types/said'
import { Dispatch, DispatchProp } from 'react-redux'





// action type
export const constants = {
  ADD: 'SAID/ADD',
  UPDATE: 'SAID/UPDATE',
  LOAD: 'SAID/LOAD',
  REMOVE: 'SAID/REMOVE',
}

// actions

export interface ActionAdd<T> {
  type: typeof constants.ADD,
  payload: T,
  error: boolean | null,
  meta: string,
}


export interface DispatchProps {
  add(item: SaidModel): ActionAdd<SaidModel>
  loadSaidLists(): Dispatch<ActionAdd<SaidModel>>
}

export const actions: DispatchProps = {
  // 社区规范参见这里：https://github.com/acdlite/flux-standard-action
  add: (item: SaidModel): ActionAdd<SaidModel> => ({
    type: constants.ADD,
    // 数据载体， containers 中的容器组件会 dispatch 数据到这里（也就是 item）
    payload: item,
    error: false, // error 的情况下为 true，并且 payload 为 Error 数据
    meta: '元数据，提供数据描述'
  }),

  loadSaidLists: () => {
    // 通过 redux-thunk 中间件，返回函数
    return (dispatch: Dispatch<ActionAdd<SaidModel>>) => {
      return new Promise<SaidModel[]>((resolve: (values: SaidModel[]) => void) => {
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
      }).then((datas: SaidModel[]) => {
        return datas.map((data) => {
          return dispatch(actions.add(data))
        })
      })
    }
  }
}



const initialState: SaidModel[] = [] // Article

// reducer = 处理数据
export default function (state: SaidModel[] = initialState /* state 应该有一个默认值 */, action: ActionAdd<SaidModel>) {
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






