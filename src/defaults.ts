import { AxiosRequestConfig } from './types'

/**
 * Axios 默认配置
 */
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
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
