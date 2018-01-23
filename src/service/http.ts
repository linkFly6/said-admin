import { Returns, ReturnsError } from '../models/returns'
import { isLoginFailCode } from './user'
import store from '../store'
import history from '../assets/js/history'
import { message } from 'antd'

// process.env.NODE_ENV

function getQueryString(params: object) {
  var esc = encodeURIComponent
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&')
}
/**
 *  通用请求，底层使用 ajax()，对返回结果使用 Promise<Returns> 封装，业务建议使用 fetch
 * @param  {string} [uri] 请求 uri
 * @param  {string} [data={}] 请求数据
 * @param  {string} [method='get'] http method
 * @param  {object} [headers={}] 请求头
 * @param  {boolean} [isFormData=false] 是否是 FormData（二进制数据）
 * @param  {number} [timeout] 超时时间
 * @return Promise<Returns>
 */
export const innerFetch = <T>(
  uri: string,
  data?: object,
  method = 'get',
  headers = {}): Promise<Returns<T>> => {
  // const requestData = data || {}
  // let url = new URL(uri)
  // if (data && method === 'get') {
  //   Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  // }

  let options: { method: string, headers: any, body?: any } = {
    method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
  }
  if (data) {
    if (data && method === 'get') {
      uri = `${uri}${~uri.indexOf('?') ? '' : '?'}${getQueryString(data)}`
    } else if (data instanceof FormData) {
      // formdata
      options.body = data
      options.headers = Object.assign({ 'Content-Type': 'multipart/form-data' }, headers)
    } else {
      options.body = JSON.stringify(data)
    }
  }
  return window.fetch(uri, options).then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json()
    } else {
      var error = new Error(response.statusText)
      throw error
    }

  }).then(json => {
    if (json.code !== 0) {
      return new Returns<T>(new ReturnsError(json.code, json.message))
    }
    return new Returns<T>(json)
  }).catch(err => {
    return new Returns<T>(err)
  })
}

/**
 * 通用请求，底层使用 ajax()，对返回结果使用 Promise<Returns> 封装，同时自动挂载 token
 * 比 innerFetch 多了一层登录业务的包装
 * @param  {string} [uri] 请求 uri
 * @param  {string} [data={}] 请求数据
 * @param  {string} [method='get'] http method
 * @param  {object} [headers={}] 请求头
 * @param  {number} [timeout] 超时时间
 * @return Promise<Returns>
 */
export function fetch<T>(
  uri: string,
  data?: object,
  method: string = 'get',
  headers: object = {}): Promise<Returns<T>> {
  // const channelId = window.$store.state['business/user'].channelId
  return innerFetch<T>(
    uri,
    Object.assign({ token: store.admin.token }, data),
    method, headers
  ).then((returns: Returns<T>) => {
    if (!returns.success) {
      if (isLoginFailCode(returns.code)) {
        // 登录失败要重新
        history.replace({
          pathname: '/login',
          search: 'src=' + encodeURIComponent(history.location.pathname + history.location.search)
        })
      }
      message.error(`${returns.message}${returns.code == null ? '' : `(${returns.code})`}`)
    }
    return returns
  })
}

/**
 * 通用请求，底层使用 ajax()，对返回结果使用 Promise<Returns> 封装
 * 比 innerFetch 多了一层登录业务的包装
 * POST 请求
 * @param  {string} [uri] 请求 uri
 * @param  {string} [data={}] 请求数据
 * @param  {boolean} [isFormData=false] 是否是 FormData（二进制数据）
 * @param  {object} [headers={}] 请求头
 * @return Promise<Returns>
 */
export function post<T>(uri: string, data?: object, headers?: object): Promise<Returns<T>> {
  return fetch<T>(uri, data, 'post', headers)
}
