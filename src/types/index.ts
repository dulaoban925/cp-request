/**
 * 请求方法类型
 */
export type Method = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'options' | 'OPTIONS' | 'head' | 'HEAD' | 'patch' | 'PATCH'

/**
 * Axios请求配置类型
 */
export interface AxiosRequestConfig {
    url: string;
    method?: Method;
    data?: any;
    params?: any;
}