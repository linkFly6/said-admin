import { AdminModel } from '../types/admin'



// action types
export const constants = {
  ADD: 'BLOG/ADD',
  LOGIN: 'ADMIN/LOGIN',
}


// actions
export interface ActionLogin<T> {
  type: typeof constants.LOGIN,
  payload: T,
  error: boolean | null,
  meta: string,
}

export interface DispatchProps {
  login(name: string, pwd: string): Promise<ActionLogin<AdminModel>>
}

// export const actions: DispatchProps = {
//   login: (name: string, pwd: string): Promise<ActionLogin<AdminModel>> => {
//     return (dispatch: Dispatch<ActionLogin<AdminModel>>) => {
//       return new Promise<AdminModel | null>((resolve: (values: AdminModel | null) => void) => {
//         setTimeout(
//           () => {
//             resolve(null)
//           }, 1000)
//       }).then((datas: AdminModel | null) => {
//         return datas.map((data) => {
//           return dispatch(actions.add(data))
//         })
//       })
//     }
//   }
// }