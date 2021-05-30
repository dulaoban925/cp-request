/** URL相关的辅助函数 */
import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string,
  host: string
}

/**
 * encode URL拼接参数
 * @param url
 * @param params
 * @returns
 */
export function encode(val: string): string {
  // 支持特殊字符，不进行转义
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}

/**
 * 构建请求URL
 * @param url
 * @param params
 * @returns
 */
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    // 若 params 为 URLSearchParams 类型，直接返回它的 toString 后的结果
    serializedParams = params.toString()
  } else {
    const parts: string[] = [] // 保存参数key-val字符串，用于拼接
    Object.keys(params).forEach((key) => {
      const val = params[key]
      // 过滤空值，直接跳过
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values: any[] = []
      // 数组url形式：/base/get?foo[]=bar&foo[]=baz'
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach((value) => {
        if (isDate(value)) {
          // Date URL 形式：/base/get?date=2019-04-01T05:55:39.030Z，date后拼接的是date.toISOString()后的结果
          value = value.toISOString()
        } else if (isPlainObject(value)) {
          // 对象 URL 形式：/base/get?foo=%7B%22bar%22:%22baz%22%7D，foo 后拼接的是{"bar":"baz"} encode 后的结果
          value = JSON.stringify(value)
        }

        parts.push(`${encode(key)}=${encode(value)}`)
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const hashIndex = serializedParams.indexOf('#')
    if (hashIndex > -1) {
      // 丢弃URL中的hash标记
      url = url.slice(0, hashIndex)
    }
    // 保留URL中已存在的参数
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }
  return url
}

export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string) {
  return relativeURL ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}` : baseURL
}

/** 判断请求的 url 与当前页面是否同源 */
export function isURLSameOrigin(requestUrl: string): boolean {
  const parsedOrigin = resolveURL(requestUrl)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

const urlParsingNode = document.createElement('a')
// 获取当前页面的源
const currentOrigin = resolveURL(window.location.href)

/** 解析 url，获取源，包括协议 protocol 和 域名 host */
export function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
