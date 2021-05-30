import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason: Cancel): void;
}

/**
 * 主动取消请求类
 * 用于如下调用形式：
 * 1.
 *  let cancelToken;
 *  RequestConfig: {
 *    cancelToken: new CancelToken(function executor(c) { cancelToken = c });
 *  }
 *  cancelToken("取消请求");
 *  调用 cancelToken 方法将 Promise 从 pending 状态转化为 fulfilled 状态，已执行以下代码逻辑停止请求；
 *
 * 2.
 *  const CancelToken = axios.CancelToken;
 *  const source = CancelToken.source();
 *  RequestConfig: {
 *    cancelToken: source.token;
 *  }
 *  source.cancel("取消请求");
 */
export default class CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise;

    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      // 防止重复取消，reason 仅取消后才会赋值
      if (this.reason) {
        return;
      }
      this.reason = new Cancel(message);
      resolvePromise(this.reason);
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /** 静态方法，cancel 方法用于取消请求 */
  static source(): CancelTokenSource {
    let cancel!: Canceler;
    const token = new CancelToken(c => {
      cancel = c;
    })

    return {
      cancel,
      token
    }
  }
}
