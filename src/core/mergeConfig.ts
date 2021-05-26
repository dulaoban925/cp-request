/**
 * 合并 config 配置项
 */
import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'

/** 合并策略，默认合并策略，val2 优先 */
function defaultStrategy(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1;
}

function fromVal2Strategy(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2;
  }
}

function deepMergeStrategy(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2);
  } else if (typeof val2 !== 'undefined') {
    return val2;
  } else if (isPlainObject(val1)) {
    return deepMerge(val1);
  } else {
    return val1;
  }
}

const strats = Object.create(null); // 合并策略映射

const stratKeysFromVal2 = ['url', 'data', 'params'];
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strategy;
})

const stratKeysDeepMerge = ['headers'];
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrategy;
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key);
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key);
    }
  }

  function mergeField(key: string): void {
    const strategy = strats[key] || defaultStrategy;
    config[key] = strategy(config1[key], config2![key])
  }

  return config
}
