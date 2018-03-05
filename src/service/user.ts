import { innerFetch } from './http'
import { setCookie, getCookie } from '../service/utils/store'
import store from '../store'
import history from '../assets/js/history'
import { COOKIENAME } from '../store/admin'
import { message } from 'antd'

export const isLoginFailCode = (code: number) => {
  return code === 10000 || code === 10001
}

let userReadyPromise: Promise<number>

export const setUserReadyPromise = (promise: Promise<number>) => {
  userReadyPromise = promise
}

/**
 * 用户信息(token) 是否已经 ready
 * - 已经 ready 返回 0
 * - 跳转到登录返回 1
 * - token 失效返回 2
 */
export const userReady = () => {
  // 已经 ready 则返回 ready
  if (userReadyPromise != null) return userReadyPromise
  if (!store.admin.token) {
    let token = getCookie(COOKIENAME)
    if (!token) {
      history.replace({
        pathname: '/login',
        search: 'src=' + encodeURIComponent(history.location.pathname + history.location.search)
      })
      userReadyPromise = Promise.resolve(1)
    }
    // 远程获取用户信息
    userReadyPromise = store.admin.checkUserState(token).then(returns => {
      if (!returns.check()) {
        message.error(returns.message)
        if (returns.code === 6) {
          history.replace({
            pathname: '/login',
            search: 'src=' + encodeURIComponent(history.location.pathname + history.location.search)
          })
        }
        return Promise.resolve(2)
      }
      return Promise.resolve(returns.check() ? 0 : 2)
    })
    return userReadyPromise
  }
  return Promise.resolve(0)
}