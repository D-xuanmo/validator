/**
 * 所有内置的规则
 */
export type RuleNames =
  | 'required'
  | 'length'
  | 'email'
  | 'min'
  | 'max'
  | 'number'
  | 'integer'
  | 'float'

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

export type ValidateContextType = {
  /**
   * 当前校验的所有数据
   */
  data: Readonly<ValidateDataModel>
}

/**
 * 校验方法
 * @param value 当前值
 * @param ruleValue 当前校验规则的值
 * @param context
 */
export type ValidatorHandlerType<TValue = unknown> = (
  value: TValue,
  ruleValue?: string | undefined,
  context?: ValidateContextType
) => boolean | Promise<boolean>

/**
 * 校验模型
 */
export type ValidatorModelType = ValidatorRuleModel & {
  /**
   * 校验规则，以管道符分隔，冒号后边的为校验规则值
   * @example
   * 'required|max:20'
   */
  rules?: string
}

/**
 * 范围校验，用于数据模型内的校验规则，优先级高于 rules
 */
export type ScopeValidateType = OmitObjectProperties<ValidatorRuleModel, 'validator'> & {
  /**
   * 当前字段数据
   * @param value
   * @param context
   */
  validator(value: unknown, context?: ValidateContextType): boolean | Promise<boolean>
}

/**
 * 校验是否返回类型
 */
export type ValidateErrorType = {
  /**
   * 错误信息
   */
  message: string

  /**
   * 当前校验失败 key
   */
  name: string
}

/**
 * 校验数据模型
 */
export type ValidateDataModel = Record<string, {
  value: unknown
  message?: string
} & OmitObjectProperties<ValidatorModelType, 'message'>>
