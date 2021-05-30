import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { xhr } from "./xhr";
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'

export function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then((res) => {
      return transformResponseData(res);
    });
}

/** 处理config参数 */
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method!);
}

/** 处理url */
export function transformURL(config: AxiosRequestConfig): string {
    let { url, params, paramsSerializer, baseURL } = config;
    if (baseURL && !isAbsoluteURL(url!)) {
      url = combineURL(baseURL, url);
    }
    return buildURL(url!, params, paramsSerializer);
}

/** 处理请求的data */
function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data);
}

/** 处理 headers */
function transformHeaders(config: AxiosRequestConfig): any {
    const { headers = {}, data } = config;
    return processHeaders(headers, data);
}

/** 处理 response data */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}

/** 校验 cancelToken 是否使用，重复使用将抛出异常且不发送请求 */
function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
