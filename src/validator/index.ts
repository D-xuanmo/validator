import rules from '../rules'
import { LocaleMessageType, OmitObjectProperties, ValidatorRuleModel } from '../types'
import {
  ScopeValidateType,
  ValidateContextType,
  ValidateDataModel,
  ValidateErrorType,
  ValidatorModelType
} from './types'
import { isObject, isPromise, throwError } from '@xuanmo/javascript-utils'

class Validator {
  /**
   * 错误信息
   */
  private locale: LocaleMessageType['message'] | null = null

  /**
   * 校验模型
   */
  private validateModel: Map<string, ValidatorRuleModel> = new Map()

  /**
   * 设置国际化
   * @param locale
   */
  localize = (locale: LocaleMessageType) => {
    this.locale = locale.message
    this.resolveDefaultRules()
  }

  /**
   * 扩展校验规则
   * @param name 规则名称
   * @param rules 校验规则
   */
  extend = (name: string, rules: ValidatorRuleModel) => {
    this.validateModel.set(name, rules)
  }

  /**
   * 扩展多条规则
   * @param rules 多个校验规则
   */
  extends = (rules: Record<string, ValidatorRuleModel>) => {
    for (const [key, value] of Object.entries(rules)) {
      this.extend(key, value)
    }
  }

  /**
   * 解析内置校验规则
   */
  private resolveDefaultRules = () => {
    for (const [key, value] of Object.entries(rules)) {
      this.extend(key, {
        message: (this.locale as never)[key],
        validator: value
      })
    }
  }

  /**
   * 解析单条校验规则
   * @param rules 校验规则
   */
  private parseRule(rules: ValidatorModelType['rules']) {
    return rules?.split('|')
  }

  /**
   * 格式化错误信息
   * @param message
   * @param fieldName
   * @param replaceMap
   */
  private formatMessage(message: string, fieldName: string, ...replaceMap: string[]) {
    let index = 0
    return message
      .replace(/\{#field}/gi, fieldName)
      .replace(/\{[a-z]+}/gi, () => {
        const replaced = replaceMap[index]
        index++
        return replaced ?? ''
      })
  }

  /**
   * 正则校验规则
   * @param value
   * @param regexp
   */
  private regexpValidateHandler(value: unknown, regexp: ValidatorRuleModel['regexp']) {
    if (value) return new RegExp(regexp!).test(value as string)
    return true
  }

  /**
   * 范围校验规则
   * @param value 当前字段数据
   * @param fieldName 当前字段对应 key
   * @param ruleModel 校验模型
   * @param context 校验上下文
   */
  private async scopeValidateHandler(
    value: unknown,
    fieldName: string,
    ruleModel: ScopeValidateType,
    context: ValidateContextType
  ): Promise<boolean | ValidateErrorType> {
    // 校验结果
    let result = true
    if (ruleModel.regexp) {
      result = this.regexpValidateHandler(value, ruleModel.regexp)
    }
    if (ruleModel.validator) {
      result = isPromise(ruleModel.validator)
        ? await ruleModel.validator?.(value, context)!
        : ruleModel.validator?.(value, context) as boolean
    }
    if (!result) {
      return {
        message: ruleModel.message,
        name: fieldName
      }
    }
    return true
  }

  /**
   * 单条规则执行校验
   * @param value 被校验数据
   * @param fieldName 字段 key
   * @param ruleModel 校验模型
   * @param context 校验上下文
   */
  private async validateHandler(
    value: unknown,
    fieldName: string,
    ruleModel: OmitObjectProperties<ValidatorModelType, 'message'>,
    context: ValidateContextType
  ): Promise<boolean | ValidateErrorType> {
    const rules = this.parseRule(ruleModel.rules)
    let errorResult: ValidateErrorType | null = null
    if (rules) {
      for (let i = 0; i < rules.length; i++) {
        const item = rules[i]
        const [ruleName, ruleValue] = item.split(':')
        const validateModel = this.validateModel.get(ruleName)
        if (!validateModel) throwError('validator', `${ruleName}规则未注册`)
        // 校验结果
        let result = true
        if (ruleModel.regexp) {
          result = this.regexpValidateHandler(value, validateModel.regexp)
        }
        if (validateModel.validator) {
          result = isPromise(validateModel.validator)
            ? await validateModel.validator?.(value, ruleValue, context)!
            : validateModel.validator?.(value, ruleValue, context)! as boolean
        }
        if (!result) {
          errorResult = {
            message: this.formatMessage(validateModel.message, fieldName, ruleValue),
            name: fieldName
          }
          break
        }
      }
      return errorResult as ValidateErrorType
    }
    return true
  }

  /**
   * 执行校验
   * @param data 校验数据
   */
  validate = (data: ValidateDataModel): Promise<true | ValidateErrorType> => {
    return new Promise((resolve, reject) => {
      (async () => {
        for (const [fieldName, rule] of Object.entries(data)) {
          const { value, ...rest } = rule
          let result
          // 如果当前数据存在范围校验，则不需要执行 rules 规则
          if (rest.regexp || rest.validator) {
            result = await this.scopeValidateHandler(value, fieldName, rest as ScopeValidateType, {
              data
            })
          } else {
            result = await this.validateHandler(value, fieldName, rest, {
              data
            })
          }
          if (isObject(result)) reject(result)
        }
        resolve(true)
      })()
    })
  }
}

export default Validator
