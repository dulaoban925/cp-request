import { AxiosRequestConfig } from "./types";

/**
 * 实际发送请求的方法，使用XMLHttpRequest
 */
export function xhr(config: AxiosRequestConfig): void {
    const { url, method = 'GET', data = null, headers } = config;
    const xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    Object.keys(headers).forEach((name) => {
        if (data === null && name.toLowerCase() === 'content-type') {
            delete headers[name];
        } else {
            xhr.setRequestHeader(name, headers[name]);
        }
    })
    xhr.send(data);
}