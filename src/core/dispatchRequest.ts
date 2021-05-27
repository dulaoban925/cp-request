import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { xhr } from "./xhr";
import { buildURL } from "../helpers/url";
import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'

export function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
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
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config;
    return buildURL(url!, params);
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
