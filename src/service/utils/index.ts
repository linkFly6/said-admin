
/**
 * url 参数解码
 * @param url 
 */
export const deserializeUrl = <T = object>(url: string) => {
  url = ~url.indexOf('?') ? url.split('?')[1] : url
  url = decodeURIComponent(url)
  const res: T = {} as any
  let tmp
  let params = url.split('#')[0].split('&')

  params.forEach(function (str: string) {
    tmp = str.split('=')
    // %3D:=，是否支持深度解码
    res[tmp[0]] = tmp[1]
  })
  return res
}

/**
 * 将一个对象序列化为 url（仅支持 1 级序列化，不支持多级）
 */
export const serializeUrl = (obj: object) => {
  return Object.keys(obj).reduce<string[]>((res, name) => {
    if (obj[name] != null) {
      res.push(encodeURIComponent(name) + '=' + encodeURIComponent(obj[name]))
    }
    return res
  }, []).join('&')/*.replace(/%20/g, '+')*/
}



/**
 * 对比 traget 和 obj，target 所有包含的属性和 obj 是否对等
 * 主要根据 target 的属性进行对比；而 obj 有， target 没有的属性不影响对比
 * @param target 
 * @param obj 
 */
export const targetDiffInObj = (target: object, obj: object) => {
  return Object.keys(target).every(key => {
    return target[key] === obj[key]
  })
}