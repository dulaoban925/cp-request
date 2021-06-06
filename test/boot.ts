const JasmineCore = require('jasmine-core')
const jasmine1 = require('jasmine')

// hack: 为让 jasmine-ajax 插件运行成功，需要手动添加全局 getJasmineRequireObj 方法，参考【https://github.com/jasmine/jasmine-ajax/issues/178】
// @ts-ignore
global.getJasmineRequireObj = function() {
  return JasmineCore
}
// hack: 处理 jasmine-ajax 抛错 jasmine is not defined
// @ts-ignore
global.jasmine = jasmine1
require('jasmine-ajax')
