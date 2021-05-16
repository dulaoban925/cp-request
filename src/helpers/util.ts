/** 通用工具函数集合*/
const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
  return toString.apply(val) === '[object Date]';
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object';
}