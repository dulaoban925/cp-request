import { AxiosRequestConfig } from "./types";

/**
 * 实际发送请求的方法，使用XMLHttpRequest
 */
export function xhr(config: AxiosRequestConfig): void {
    const { url, method = 'GET', data = null } = config;
    const xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    xhr.send(data);
}