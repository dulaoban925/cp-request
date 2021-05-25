/**
 * 通用工具函数集合
 */
const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.apply(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
  return toString.apply(val) === '[object Object]'
}

/** 混合类型，将 from 的实例属性和原型属性合并到 to */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
