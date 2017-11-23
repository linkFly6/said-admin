/*
 redux 围绕：actionTypes/actions/reducer 进行工作，但是拆开之后样板文件太多了
 所以这里采用 ducks 设计：https://github.com/erikras/ducks-modular-redux
*/
// import Promise from 'Promise'
// actionTypes
import { LogFileModel } from '../types/dashboard'
import { Dispatch } from 'react-redux'

export const constants = {
  ADD: 'SAID/ADD',
  UPDATE: 'SAID/UPDATE',
  LOAD: 'SAID/LOAD',
  REMOVE: 'SAID/REMOVE',
}



const initialState: LogFileModel[] = [] // Article

// reducer = 加工数据
export default function (state: LogFileModel[] = initialState /* state 应该有一个默认值 */, action: LogFileAdd<LogFileModel>) {
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

export interface LogFileAdd<T> {
  type: typeof constants.ADD,
  payload: T,
  error: any | null,
  meta: string,
}


export interface DispatchProps {
  add(item: LogFileModel): LogFileAdd<LogFileModel>
  loadByRemote(): Dispatch<LogFileAdd<LogFileModel>>
}

// actions = 获取数据
export const actions = {
  // 社区规范参见这里：https://github.com/acdlite/flux-standard-action
  add: (item: LogFileModel): LogFileAdd<LogFileModel> => ({
    type: constants.ADD,
    // 数据载体， containers 中的容器组件会 dispatch 数据到这里（也就是 item）
    payload: item,
    error: null, // error 的情况下为 true，并且 payload 为 Error 数据
    meta: '元数据，提供数据描述'
  }),

  loadByRemote: () => {
    // 通过 redux-thunk 中间件，返回函数
    return (dispatch: Dispatch<LogFileAdd<LogFileModel>>) => {
      return new Promise<LogFileModel[]>((resolve: (values: LogFileModel[]) => void) => {
        window.setTimeout(
          function () {
            resolve([{
              size: 1024,
              type: 'info',
              date: Date.now(),
            }])
          },
          2000)
      }).then((datas: LogFileModel[]) => {
        datas.forEach((data) => {
          dispatch(actions.add(data))
        })
      })
    }
  }
}
