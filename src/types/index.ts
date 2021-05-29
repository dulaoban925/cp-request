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
  /** 用于在请求结束前，主动取消请求 */
  cancelToken?: CancelToken;
  /** 跨域 CORS 允许携带cookie */
  withCredentials?: boolean;

  /**
   * XSRF (跨站请求伪造） 相关
   * 为防止 XSRF 攻击，服务器要求每次请求都携带一个 token，token 在后端生成并通过 set-cookie 种到前端
   * 客户端请求时从 cookie 中取对一个的 token 并添加到 headers 中
   * 服务端从请求 headers 中读取 token 并验证，该 token 有后端生成，很难伪造
   */
  xsrfCookieName?: string; // cookie 中存放 xsrf token 的名称
  xsrfHeaderName?: string; // header 中传递 xsrf token 的属性名

  /**
   * HTTP 协议中的 Authorization header 头会包含服务器用于校验用户代理身份的凭证
   * 通常在服务器返回 401 UnAuthorized 状态码以及 WWW-Authenticate 消息头之后在后续的请求中发送此消息头
   * 若用户配置了 auth ，ts-axios 会自动向 HTTP 请求 header 中添加 Authorization 属性
   * 自动添加的 Authorization 值为 Basic 加密串，加密串内容为：username:password 的Base64 格式
   */
  auth?: AxiosBasicCredential;

  /**
   * 上传/下载进度监控
   */
  onDownloadProgress?: (e: ProgressEvent) => void;
  onUploadProgress?: (e: ProgressEvent) => void;
  /**
   * 自定义合法状态码
   */
  validateStatus?: (status: number) => boolean;

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
  create: (config?: AxiosRequestConfig) => AxiosInstance;

  CancelToken: CancelTokenStatic;
  Cancel: CancelStatic;
  isCancel: (value: any) => boolean;
}

/** 拦截器管理类型 */
export interface AxiosInterceptorManager<T = any> {
  // 添加拦截器，返回拦截器在拦截器容器中的id
  use(resolved: ResolvedFn<T>, reject?: RejectFn): number;

  // 通过拦截器的id，删除对应的拦截器
  eject(id: number): void;
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>;
}

export interface RejectFn {
  (val: any): any;
}

/** Axios 请求/响应数据转换函数 */
export interface AxiosTransformer {
  (data: any, headers?: any): any;
}

/** cancelToken 取消请求相关 */
export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel; // 取消请求原因

  throwIfRequested(): void;
}

export interface Canceler {
  (reason?: string): void;
}

export interface CancelExecutor {
  (executor: Canceler): void;
}

export interface CancelTokenSource {
  cancel: Canceler;
  token: CancelToken;
}

/** CancelToken 类的类类型 */
export interface CancelTokenStatic {
  new(executor: CancelExecutor): CancelToken;

  source(): CancelTokenSource;
}

export interface Cancel {
  message?: string;
}

/** Cancel 类的类类型 */
export interface CancelStatic {
  new(message?: string): Cancel;
}

/** auth 类型 */
export interface AxiosBasicCredential {
  username: string,
  password: string
}
