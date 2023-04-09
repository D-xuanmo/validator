import rules from '../rules'
import { isEmpty, isObject, isPromise, throwError } from '@xuanmo/javascript-utils'
import {
  LocaleMessageType,
  OmitObjectProperties,
  RuleParamsType,
  ScopeValidateType,
  SingleRuleType,
  ValidateContextType,
  ValidateDataModel, ValidateDataModelItem,
  ValidateErrorType,
  ValidateReturnType,
  ValidatorModelType,
  ValidatorRuleModel
} from '../types'
import { RULE_PARAMS_SEPARATOR } from './constants'

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
        validator: value.validator,
        paramsEnum: value.paramsEnum
      })
    }
  }

  /**
   * 判断是否校验失败
   * @param result 校验结果
   * @return boolean true 代表校验未通过
   */
  private isValidateFail(result: unknown): boolean {
    return (result as any) !== true
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
   * @param message 错误信息
   * @param fieldName 当前字段
   * @param ruleParams 校验规则参数
   * @param paramsEnum 参数映射
   */
  private formatMessage(
    message: string,
    fieldName: string,
    ruleParams?: RuleParamsType,
    paramsEnum?: SingleRuleType['paramsEnum']
  ) {
    let formatted = message.replace(/\{#field}/gi, fieldName)

    if (Array.isArray(ruleParams)) {
      if (isEmpty(paramsEnum)) throwError('validator', `The {${fieldName}} field validation rule parameter is not defined.`)
      ruleParams.forEach((item, index) => {
        formatted = formatted.replace(new RegExp(`\\{${paramsEnum![index].name}}`), item)
      })
    }

    if (typeof ruleParams === 'string') {
      formatted = formatted.replace(/\{[a-z]+}/i, ruleParams)
    }

    return formatted
  }

  /**
   * 正则校验规则
   * @param value 被校验值
   * @param regexp 正则
   */
  private regexpValidateHandler(value: unknown, regexp: ValidatorRuleModel['regexp']) {
    if (value) return new RegExp(regexp!).test(value as string)
    return true
  }

  /**
   * 处理 rules 字段 value
   * @param ruleParams 规则参数
   */
  private formatRuleParams(ruleParams: RuleParamsType) {
    if (!ruleParams) return ruleParams

    if (ruleParams.includes(RULE_PARAMS_SEPARATOR)) {
      return (ruleParams as string).split(RULE_PARAMS_SEPARATOR)
    }

    return ruleParams
  }

  /**
   * 范围校验规则
   * @param value 当前字段数据
   * @param ruleModel 校验模型
   * @param context 校验上下文
   */
  private async scopeValidateHandler(
    value: unknown,
    ruleModel: ScopeValidateType,
    context: ValidateContextType
  ): Promise<boolean | ValidateErrorType> {
    // 校验结果
    let result = true
    if (ruleModel.regexp) {
      result = this.regexpValidateHandler(value, ruleModel.regexp)
    }
    if (ruleModel.validator) {
      result = ruleModel.validator?.(value, context) as boolean
      if (isPromise(result)) {
        result = await ruleModel.validator?.(value, context)!
      }
    }
    if (!result) {
      return ruleModel.message
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
        const [ruleName, ruleParams] = item.split(':')
        const validateModel = this.validateModel.get(ruleName)
        if (!validateModel) throwError('validator', `{${ruleName}} rule not registered.`)
        // 校验结果
        let result = true
        if (validateModel.regexp) {
          result = this.regexpValidateHandler(value, validateModel.regexp)
        }
        if (validateModel.validator) {
          result = validateModel.validator?.(value, this.formatRuleParams(ruleParams), context)! as boolean
          if (isPromise(result)) {
            result = await validateModel.validator?.(value, this.formatRuleParams(ruleParams), context)!
          }
        }
        if (!result) {
          errorResult = this.formatMessage(
            validateModel.message,
            fieldName,
            this.formatRuleParams(ruleParams),
            validateModel.paramsEnum
          )
          break
        }
      }
      return errorResult === null ? true : errorResult
    }
    return true
  }

  /**
   * 转换校验数据，支持对象和数组两种模式
   * @param data
   */
  private convertData = (data: ValidateDataModel): Array<ValidateDataModelItem> => {
    if (isObject(data)) {
      return Object.keys(data).map((name) => ({
        name,
        ...(data as any)[name]
      }))
    }
    return data as Array<ValidateDataModelItem>
  }

  /**
   * 执行校验
   * @param data 校验数据
   * @param options
   */
  validate = (data: ValidateDataModel, options?: {
    // 是否校验所有规则，默认：true，如果存在多个异步校验，不建议开启
    checkAll?: boolean
  }): ValidateReturnType => {
    return new Promise((resolve, reject) => {
      (async () => {
        const { checkAll = true } = options ?? {}
        const errorResult: Record<string, ValidateErrorType> = {}
        const convertedData = this.convertData(data)
        for (let i = 0; i < convertedData.length; i++) {
          const item = convertedData[i]
          const fieldName = item.name
          const { value, ...rest } = item
          const aliasName = item.label ?? fieldName
          let result: ValidateErrorType | boolean
          // 必填校验优先级最高
          if (item.required && isEmpty(value)) {
            result = this.formatMessage(this.validateModel.get('required')!.message, aliasName)
          } else {
            // 如果当前数据存在局部校验规则，则不执行 rules 规则
            if (rest.regexp || rest.validator) {
              result = await this.scopeValidateHandler(value, rest as ScopeValidateType, {
                data
              })
            } else {
              result = await this.validateHandler(
                value,
                aliasName,
                rest,
                { data }
              )
            }
          }
          if (this.isValidateFail(result)) {
            // 如果不是校验所有，遇见第一个错误则结束本次校验
            if (!checkAll) {
              reject({ [fieldName]: result })
            }
            errorResult[fieldName] = result as ValidateErrorType
          }
        }
        if (checkAll && isObject(errorResult) && !isEmpty(errorResult)) {
          reject(errorResult)
        }
        resolve(true)
      })()
    })
  }
}

export default Validator
