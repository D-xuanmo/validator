import { OmitObjectProperties, ValidatorRuleModel } from '../types'

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
