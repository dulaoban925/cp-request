/** URL相关的辅助函数 */
import { isDate, isPlainObject } from './util';

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
export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url;
  }
  const parts: string[] = []; // 保存参数key-val字符串，用于拼接
  Object.keys(params).forEach((key) => {
    const val = params[key];
    // 过滤空值，直接跳过
    if (val === null || typeof val === 'undefined') {
      return;
    }
    let values: any[] = [];
    // 数组url形式：/base/get?foo[]=bar&foo[]=baz'
    if (Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }
    values.forEach((value) => {
      if (isDate(value)) {
        // Date URL 形式：/base/get?date=2019-04-01T05:55:39.030Z，date后拼接的是date.toISOString()后的结果
        value = value.toISOString();
      } else if (isPlainObject(value)) {
        // 对象 URL 形式：/base/get?foo=%7B%22bar%22:%22baz%22%7D，foo 后拼接的是{"bar":"baz"} encode 后的结果
        value = JSON.stringify(value);
      }

      parts.push(`${encode(key)}=${encode(value)}`);
    })
  })

  let serializedParams = parts.join('&');
    if (serializedParams) {
      const hashIndex = serializedParams.indexOf('#');
      if (hashIndex > -1) {
        // 丢弃URL中的hash标记
        url = url.slice(0, hashIndex);
      }
      // 保留URL中已存在的参数
      url += (url.includes('?') ? '&' : '?') + serializedParams;
    }
    return url;
}