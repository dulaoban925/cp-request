import { AxiosRequestConfig } from "./types";
import { xhr } from "./xhr";
import {buildURL} from "./helpers/url";

function Axios(config: AxiosRequestConfig) {
    processConfig(config);
    xhr(config);
}
/** 处理config参数 */
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
}

/** 处理url */
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config;
    return buildURL(url, params);
}

export default Axios;