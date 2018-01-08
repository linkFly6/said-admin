import history from '../assets/js/history'
import { innerFetch } from './http'


export const isLoginFailCode = (code: number) => {
  return code === 10001
}

export const login = (maxCount = 2) => {
  return Promise.resolve()
}