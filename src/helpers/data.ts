/** 处理 data 辅助函数 */
import { isPlainObject } from './util'

/** 处理请求的 data 数据 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/** 请求返回的 data 数据 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // 不需要处理，仅捕获不抛错
    }
  }

  return data
}
