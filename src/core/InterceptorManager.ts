import { RejectFn, ResolvedFn } from "../types";

/** Axios 拦截器管理类 */
interface Interceptor<T> {
  resolved: ResolvedFn<T>,
  rejected?: RejectFn
}

export default class InterceptorManager<T = any> {
  private interceptors: Array<Interceptor<T> | null>;

  constructor() {
    this.interceptors = [];
  }

  // 添加拦截器
  use(resolved: ResolvedFn, rejected?: RejectFn): number {
    this.interceptors.push(
      {
        resolved,
        rejected
      }
    )
    return this.interceptors.length - 1;
  }

  // 内部方法，用于遍历拦截器
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    })
  }

  // 删除指定拦截器
  eject(id: number): void {
    if (this.interceptors[id]) {
      // 因为 use 方法会返回拦截器的id用于本方法删除，所以不能使用splice的方法删除数组元素，因为会导致数组长度改变，使得 use 方法返回的 id 失效；
      this.interceptors[id] = null;
    }
  }

}
