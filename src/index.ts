import { AxiosRequestConfig } from "./types";
import { xhr } from "./xhr";
import { buildURL } from "./helpers/url";
import { transformRequest } from './helpers/data';

function Axios(config: AxiosRequestConfig) {
    processConfig(config);
    xhr(config);
}
/** 处理config参数 */
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
    config.data = transformRequestData(config);
}

/** 处理url */
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config;
    return buildURL(url, params);
}

/** 处理请求的data */
function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data);
}

export default Axios;