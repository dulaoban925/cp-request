/**
 * 通过 jasmine.Ajax.requests.mostRecent() 获取最近一次请求的 request 对象
 * 该 request 对象是 jasmine-ajax 伪造的 xhr 对象，可模拟 xhr 对象上的方法，并提供一些api
 */
export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(function(resolve) {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
