import history from '../assets/js/history'
import { innerFetch } from './http'
import * as cookie from 'js-cookie'


export const isLoginFailCode = (code: number) => {
  return code === 10001
}

