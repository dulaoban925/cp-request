/** 处理 data 辅助函数 */
import { isPlainObject } from './util';

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}