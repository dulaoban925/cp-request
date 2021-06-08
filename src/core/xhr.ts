import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { transformResponse } from '../helpers/data'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

/**
 * 实际发送请求的方法，使用XMLHttpRequest
 */
export function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'GET',
      data = null,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      // 跨域允许携带 Cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
      // 利用 XMLHttpRequest 的 progress 事件，监控数据的下载进度
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      // 利用 XMLHttpRequest.upload 对象的 progress 事件，监听数据上传进度
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        // 请求未结束，不执行后续逻辑
        if (request.readyState !== 4) {
          return
        }
        // 请求发生错误直接返回
        if (request.status === 0) {
          return
        }
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType === 'text' ? request.responseText : request.response
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }
    }

    function processHeaders(): void {
      // 如果请求的数据是 FormData 类型，删除 headers 中的 Content-Type 字段，让浏览器自动根据请求数据设置
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      /**
       * 若 withCredential 为 true 或为同源请求，对 headers 添加 xsrf 相关的字段
       * 若满足上述条件，从 cookie 中读取 xsrf 的 token 值
       * 若读取到 token ，添加到 headers 的 xsrf 相关字段中
       */
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }
      // 若配置了 auth ，自动向 headers 中添加 Authorization 属性
      if (auth) {
        headers['Authorization'] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`
      }
      // 循环设置每个 headers 配置
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      // 允许主动取消请求
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(
            // 添加注释，忽略该部分代码的测试
            /* istanbul ignore next */
            () => {
              // 不需要处理
            }
          )
      }
    }

    function handleResponse(response: AxiosResponse): void {
      // 如果 validateStatus 配置项为空，说明配置指定所有状态码均为合法状态码
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
