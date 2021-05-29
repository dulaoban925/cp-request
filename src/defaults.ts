import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

/**
 * Axios 默认配置
 */
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  transformRequest: [function(data: any, headers?: any): any {
    processHeaders(headers, data);
    return transformRequest(data);
  }],
  transformResponse: [function(data: any): any {
    return transformResponse(data);
  }]
}

// 为不同的请求方法添加默认 headers 配置
const methodsWithoutData = ['get', 'delete', 'head', 'options'];
methodsWithoutData.forEach(method => {
  defaults.headers[method] = {};
})

const methodsWithData = ['post', 'put', 'patch'];
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
})

export default defaults;
