
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


/**
 * 函数节流 -  把原函数封装为拥有函数节流阀的函数，当重复调用函数，只有到达这个阀值（wait毫秒）才会执行
 * 引自underscore
 * @param {function} func - 回调函数
 * @param {int} wait - 阀值(ms)
 * @param {object} options = null - 想禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}
 * @returns {function}
 */
export const throttle = function (
  func: any,
  wait: number, options: { leading?: boolean, trailing?: boolean } = {}) {
  var context, args, result
  var timeout: number | null = null
  var previous = 0
  var later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function (this: any) {
    var now = Date.now()
    if (!previous && options.leading === false) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        window.clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = window.setTimeout(later, remaining)
    }
    return result
  }
}


/**
 * 函数节流 -  把原函数封装为拥有防反跳的函数，延迟函数的执行(wait毫秒)，当重复调用函数时候，只执行最后一个调用（在wait毫秒之后）
 * 引自backbone
 * @param {function} func - 回调函数
 * @param {int} wait - 参数
 * @param {object} immediate = false - 表示是否逆转调用时机，为true表示：wait毫秒内的多次调用，仅第一次生效
 * @returns {function}
 */
export const debounce = function (func: any, wait: number, immediate: boolean = false) {
  var timeout, args, context, timestamp, result

  var later = function () {
    var last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (this: any) {
    context = this
    args = arguments
    timestamp = Date.now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}


/**
 * 判断是否为空对象 => {}
 * @param obj 
 */
export const isEmptyObject = (obj: any) => {
  return !Object.keys(obj).length
}