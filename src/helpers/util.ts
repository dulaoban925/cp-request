/**
 * 通用工具函数集合
 */
const toString = Object.prototype.toString

/** 是否为对象类型，包括不同对象和特殊对象，如Date */
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

/** 是否为日期类型 */
export function isDate(val: any): val is Date {
  return toString.apply(val) === '[object Date]'
}

/** 是否为普通对象类型 */
export function isPlainObject(val: any): val is Object {
  return toString.apply(val) === '[object Object]'
}

/** 是否为 FormData 类型 */
export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

/** 是否为 URLSearchParams 类型 */
export function isURLSearchParams(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

/** 混合类型，将 from 的实例属性和原型属性合并到 to */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/** 深度合并多个对象 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
