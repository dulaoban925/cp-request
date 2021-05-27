import { AxiosTransformer } from '../types'

/**
 * 请求，详情配置函数转换方法
 */
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
  if (!fns) {
    return data;
  }
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  fns.forEach(fn => {
    data = fn(data, headers);
  })

  return data;
}
