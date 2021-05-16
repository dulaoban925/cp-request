/** 处理 header 辅助函数 */
import { isPlainObject } from './util';

/** 将 headers 的属性名称标准化，如支持前端配置名称为 content-type， 但是需要转为 Content-Type */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return;
  }
  Object.keys(headers).forEach((name) => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  })
}

/** 处理请求头 headers 配置 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type');
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers;
}

/** 解析响应头 headers 字符串，返回对象结构 */
export function parseHeaders(headers: string): any {
  const parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }
  headers.split('\r\n').forEach((line) => {
    let [key, value] = line.split(':');
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    if (value) {
      value = value.trim();
    }
    parsed[key] = value;
  })

  return parsed;
}