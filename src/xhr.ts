import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types";
import { parseHeaders } from './helpers/headers';
import { transformResponse } from './helpers/data';

/**
 * 实际发送请求的方法，使用XMLHttpRequest
 */
export function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { url, method = 'GET', data = null, headers, responseType } = config;
        const request = new XMLHttpRequest();
        if (responseType) {
            request.responseType = responseType;
        }
        request.open(method.toUpperCase(), url, true);
        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {
                return;
            }
            const responseHeaders = parseHeaders(request.getAllResponseHeaders());
            const responseData = transformResponse(responseType && responseType === 'text' ? request.responseText : request.response);
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            resolve(response);
        }
        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name];
            } else {
                request.setRequestHeader(name, headers[name]);
            }
        })
        request.send(data);
    })
}