import { AxiosRequestConfig, AxiosResponse } from '../types'

/**
 * AxiosError 类
 */
export class AxiosError extends Error {
  isAxiosError: boolean // 是否为 Axios 错误
  config: AxiosRequestConfig // 请求配置
  code?: string | null // 错误代码
  request?: any // 请求 XMLHttpRequest 对象实例
  response?: AxiosResponse // 请求响应结果

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 手动调整 this 原型，解决 TypeScript 继承 Error 类造成的问题
    // 详见 TypeScript-Wiki：https://github.com/microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
): AxiosError {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
