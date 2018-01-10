import { Returns, ReturnsError } from '../models/returns'
import { isLoginFailCode } from './user'

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
  const requestData = data || {}
  // let url = new URL(uri)
  // if (data && method === 'get') {
  //   Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  // }

  let options: { method: string, headers: any, body?: string } = {
    method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
  }
  if (data) {
    if (data && method === 'get') {
      uri = `${uri}${~uri.indexOf('?') ? '' : '?'}${getQueryString(data)}`
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
 * 通用请求，底层使用 ajax()，对返回结果使用 Promise<Returns> 封装
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
  data: object,
  method: string = 'get',
  headers: object = {}): Promise<Returns<T>> {
  // const channelId = window.$store.state['business/user'].channelId
  return innerFetch<T>(uri, data, method, headers).then((returns: Returns<T>) => {
    if (!returns.success && isLoginFailCode(returns.code)) {
      // return new Promise<Returns<T>>((resolve, reject) => {
      //   login(2).then((returns: Returns<Models.State>) => {
      //     // 重试请求，如果还失败的话就只能返回错误了
      //     return innerFetch<T>(uri, data, method, headers, isFormData, timeout).then((ret: Returns<T>) => {
      //       resolve(ret)
      //     })
      //   }).catch(err => {
      //     const router = window.$router
      //     router.replace({
      //       path: '/error',
      //       query: { text: '服务器出了点小差~ (10000)' },
      //     })
      //     resolve(returns)
      //   })
      // })
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
export function post<T>(uri: string, data: object, headers?: object) {
  return fetch<T>(uri, data, 'post', headers)
}