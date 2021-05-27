/**
 * 请求方法类型
 */
export type Method =
  'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'patch'
  | 'PATCH';

/** Axios请求配置类型 */
export interface AxiosRequestConfig {
  url?: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType; // 响应数据类型
  timeout?: number; // 超时时间，单位毫秒ms

  /**
   * 函数或函数数组，允许在请求发送到服务器之前对其进行修改，只适用于 post，put，patch 等携带参数体的方法
   * 如果是数组，则最后一个函数一定要返回一个字符串或 FormData, URLSearchParams, Blob 等类型作为 xhr.send 的参数
   * 在 transform 的过程中可以修改 headers
   */
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  /**
   * 函数或函数数组，允许把响应数据传递给 then 或者 catch 之前对其进行修改
   * 如果是数组，数组的每一个函数都是转换函数，像管道一样依次执行，前者的输出作为后者的输入
   */
  transformResponse?: AxiosTransformer | AxiosTransformer[];

  [prodName: string]: any
}

/** Axios 响应数据类型，支持泛型，允许使用者通过单独的接口 interface 控制响应结果 */
export interface AxiosResponse<T = any> {
  data: T; // 服务端返回的数据
  status: number; // HTTP状态码
  statusText: string; // 状态消息
  headers: any; // 响应头
  config: AxiosRequestConfig; // 请求配置对象
  request: any; // 请求 XMLHttpRequest 对象实例
}

/**
 * Axios 请求返回类型，返回 Promise 对象, 继承于 Promise<AxiosRespose> 泛型接口
 * 这样当 axios 返回 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosRespose 类型
 */
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}

/**
 * Axios 错误类型
 */
export interface AxiosError extends Error {
  isAxiosError: boolean; // 是否为 Axios 错误
  config: AxiosRequestConfig; // 请求配置
  code?: string | null; // 错误代码
  request: any; // 请求 XMLHttpRequest 对象实例
  response: AxiosResponse; // 请求响应结果
}

/**
 * Axios 类型
 */
export interface Axios {
  defaults: AxiosRequestConfig, // 默认配置
  interceptors: { // 拦截器
    request: AxiosInterceptorManager<AxiosRequestConfig>,
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request: <T = any>(config: AxiosRequestConfig) => AxiosPromise<T>;
  get: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>;
  head: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>;
  options: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise<T>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise<T>;
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise<T>;
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>;

  <T = any>(url: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosStatic extends AxiosInstance {
  create: (config?: AxiosRequestConfig) => AxiosInstance
}

/** 拦截器管理类型 */
export interface AxiosInterceptorManager<T = any> {
  // 添加拦截器，返回拦截器在拦截器容器中的id
  use(resolved: ResolvedFn<T>, reject?: RejectFn): number;

  // 通过拦截器的id，删除对应的拦截器
  eject(id: number): void;
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectFn {
  (val: any): any;
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}
