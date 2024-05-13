import * as rules from '../rules'
import { isEmpty, isObject, isPromise, throwError } from '@xuanmo/utils'
import {
  LocaleMessageType,
  OmitObjectProperties, RuleNames,
  RuleParamsType,
  ScopeValidateType,
  SingleRuleType,
  ValidateContextType,
  ValidateDataModel,
  ValidateDataModelItem,
  ValidateDataModelMatrix,
  ValidateErrorType,
  ValidateReturnType,
  ValidatorModelType,
  ValidatorRuleModel
} from '../types'
import { RELATED_FIELD_SEPARATOR, RULE_PARAMS_SEPARATOR } from './constants'

class Validator {
  /**
   * 错误信息
   */
  private locale: LocaleMessageType['message'] | null = null

  /**
   * 校验规则模型
   */
  private validateModel: Map<string, ValidatorRuleModel> = new Map()

  /**
   * 设置国际化
   * @param locale
   */
  localize = (locale: LocaleMessageType) => {
    this.locale = locale.message
    this.resolveDefaultRules()
    return this
  }

  /**
   * 扩展校验规则
   * @param name 规则名称
   * @param rules 校验规则
   */
  extend = (name: string, rules: ValidatorRuleModel) => {
    this.validateModel.set(name, rules)
    return this
  }

  /**
   * 扩展多条规则
   * @param rules 多个校验规则
   */
  extends = (rules: Record<string, ValidatorRuleModel>) => {
    for (const [key, value] of Object.entries(rules)) {
      this.extend(key, value)
    }
    return this
  }

  /**
   * 解析内置校验规则
   */
  private resolveDefaultRules = () => {
    if (!this.locale) {
      throwError('validator', '未注册国际化词条，参考链接：https://github.com/D-xuanmo/validator#%E4%BD%BF%E7%94%A8')
    }
    for (const [key, value] of Object.entries(rules as Record<RuleNames, SingleRuleType>)) {
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
   * @param options
   */
  private formatMessage(
    message: string,
    fieldName: string,
    options?: {
      ruleParams?: RuleParamsType,
      paramsEnum?: SingleRuleType['paramsEnum'],
      context?: ValidateContextType
    }
  ) {
    const { ruleParams, paramsEnum, context } = options ?? {}
    let formatted = message.replace(/\{#field}/gi, fieldName)

    if (Array.isArray(ruleParams)) {
      if (isEmpty(paramsEnum)) {
        throwError('validator', `The {${fieldName}} field validation rule parameter is not defined.`)
      }
      ruleParams.forEach((item, index) => {
        formatted = formatted.replace(new RegExp(`\\{${paramsEnum![index].name}}`), item)
      })
    }

    if (typeof ruleParams === 'string') {
      let replaceValue = ruleParams
      if (new RegExp(`^${RELATED_FIELD_SEPARATOR}`).test(ruleParams)) {
        const item = context?.dataKeyMap.get(ruleParams.replace(RELATED_FIELD_SEPARATOR, ''))
        replaceValue = item?.label || item?.dataKey || ''
      }
      formatted = formatted.replace(/\{[a-z]+}/i, replaceValue)
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
   * 关联字段解析
   * @param params
   */
  private formatLinkField(params?: string) {
    let result

    if (params?.includes(RELATED_FIELD_SEPARATOR)) {
      result = (params as string).replace(new RegExp(RELATED_FIELD_SEPARATOR, 'g'), '')
    }

    if (result?.includes(RULE_PARAMS_SEPARATOR)) {
      return (result as string).split(RULE_PARAMS_SEPARATOR)
    }

    return result
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
          result = validateModel.validator?.(value, {
            ...context,
            ruleValue: this.formatRuleParams(ruleParams),
            linkField: this.formatLinkField(ruleParams)
          })! as boolean
          if (isPromise(result)) {
            result = await validateModel.validator?.(value, {
              ...context,
              ruleValue: this.formatRuleParams(ruleParams),
              linkField: this.formatLinkField(ruleParams)
            })!
          }
        }
        if (!result) {
          errorResult = this.formatMessage(
            validateModel.message,
            fieldName,
            {
              ruleParams: this.formatRuleParams(ruleParams),
              paramsEnum: validateModel.paramsEnum,
              context
            }
          )
          break
        }
      }
      return errorResult === null ? true : errorResult
    }
    return true
  }

  /**
   * 转换数据为 map 结构，方便后续查找数据
   * @param data
   */
  private convertDataToMap(data: ValidateDataModel): ValidateContextType['dataKeyMap'] {
    const dataKeyMap: ValidateContextType['dataKeyMap'] = new Map()
    data.forEach((item) => {
      !(item as ValidateDataModelMatrix).matrix && dataKeyMap.set(item.dataKey, item)
    })
    return dataKeyMap
  }

  /**
   * 单个规则校验
   * @param model
   * @param data
   * @param dataKeyMap
   */
  private async singleValidate(
    model: ValidateDataModelItem,
    data: ValidateDataModel,
    dataKeyMap: ValidateContextType['dataKeyMap']
  ) {
    const fieldName = model.dataKey
    const { value, ...rest } = model
    const aliasName = model.label ?? fieldName
    if ((model as ValidateDataModelMatrix).matrix) {
      const { columns, data } = (model as ValidateDataModelMatrix).value
      const errorResult: Record<string, string> = {}
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const matrixRowData = []
        for (let j = 0; j < columns.length; j++) {
          const column = columns[j]
          matrixRowData.push({
            ...column,
            rowId: item.rowId,
            matrixId: (model as ValidateDataModelMatrix).matrixId,
            value: item[column.dataKey]
          })
        }
        try {
          await this.validate(matrixRowData)
        } catch (error) {
          Object.assign(errorResult, error)
        }
      }
      return errorResult
    }
    // 必填校验优先级最高
    if (model.required && isEmpty(value)) {
      return this.formatMessage(this.validateModel.get('required')!.message, aliasName)
    }
    // 如果当前数据存在局部校验规则，则不执行 rules 规则
    if (rest.regexp || rest.validator) {
      return this.scopeValidateHandler(value, rest as ScopeValidateType, {
        data: data,
        dataKeyMap
      })
    }
    return await this.validateHandler(
      value,
      aliasName,
      rest,
      { data: data, dataKeyMap }
    )
  }

  /**
   * 执行校验
   * @param data 校验数据
   * @param options
   */
  validate(data: ValidateDataModel, options?: {
    // 是否校验所有规则，默认：true，如果存在多个异步校验，不建议开启
    checkAll?: boolean
  }): ValidateReturnType {
    return new Promise((resolve, reject) => {
      (async () => {
        const { checkAll = true } = options ?? {}
        const errorResult: Record<string, ValidateErrorType> = {}
        const dataKeyMap = this.convertDataToMap(data)
        for (let i = 0; i < data.length; i++) {
          const model = data[i]
          const result = await this.singleValidate(model, data, dataKeyMap)
          if (this.isValidateFail(result)) {
            const { matrixId, rowId } = (model as ValidateDataModelMatrix)
            // 如果不是校验所有，遇见第一个错误则结束本次校验
            if (!checkAll) {
              reject({ [model.dataKey]: result })
            }
            if (matrixId) {
              if (isObject(result)) {
                Object.assign(errorResult, result)
              } else {
                Object.assign(errorResult, {
                  [`${matrixId}.${rowId}.${model.dataKey}`]: result as ValidateErrorType
                })
              }
            } else {
              Object.assign(errorResult, {
                [model.dataKey]: result as ValidateErrorType
              })
            }
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
