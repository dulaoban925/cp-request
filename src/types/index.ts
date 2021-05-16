/**
 * 请求方法类型
 */
export type Method = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'options' | 'OPTIONS' | 'head' | 'HEAD' | 'patch' | 'PATCH'

/** Axios请求配置类型 */
export interface AxiosRequestConfig {
    url: string;
    method?: Method;
    data?: any;
    params?: any;
    headers?: any;
    responseType?: XMLHttpRequestResponseType; // 响应数据类型
}

/** Axios 请求结果 */
export interface AxiosResponse {
    data: any; // 服务端返回的数据
    status: number; // HTTP状态码
    statusText: string; // 状态消息
    headers: any; // 响应头
    config: AxiosRequestConfig; // 请求配置对象
    request: any; // 请求XMLHttpRequest对象实例
}

/** 
 * Axios 请求返回类型，返回 Promise 对象, 继承于 Promise<AxiosRespose> 泛型接口
 * 这样当 axios 返回 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosRespose 类型
 */
export interface AxiosPromise extends Promise<AxiosResponse> {}