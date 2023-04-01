import { ValidatorHandlerType } from './validator/types'

/**
 * 所有内置的规则
 */
export type RuleNames =
  | 'required'
  | 'length'
  | 'email'
  | 'min'
  | 'max'

/**
 * 国际化列表
 */
export type Locale =
  | 'zh-CN'
  | 'en'

/**
 * 国际化导出文件格式
 */
export type LocaleMessageType = {
  code: Locale | string
  message: Record<RuleNames | string, string>
}

/**
 * 校验规则模型
 */
export type ValidatorRuleModel = {
  /**
   * 失败错误信息
   */
  message: string

  /**
   * 正则校验
   */
  regexp?: RegExp | string

  /**
   * 自定义校验器
   */
  validator?: ValidatorHandlerType
}

/**
 * 排除对象中的某些属性
 */
export type OmitObjectProperties<T extends object, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key]
}
