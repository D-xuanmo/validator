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

  /**
   * 是否必填，与 rules 中的 required 等价
   */
  required?: boolean
}

/**
 * 校验方法返回值
 */
export type ValidateReturnType = Promise<boolean | ValidateErrorType>

/**
 * 校验是否返回类型
 */
export type ValidateErrorType = string

export type ValidateDataModelBaseItem = {
  /**
   * 数据对应的键值
   */
  dataKey: string

  /**
   * 当前字段值
   */
  value: unknown

  /**
   * 用于覆盖 {#field} 标识
   */
  label?: string

  /**
   * 数据每行对应的 id
   */
  rowId?: string

  /**
   * 错误信息，优先级最高
   */
  message?: string
} & OmitObjectProperties<ValidatorModelType, 'message'>

export type MatrixColumnsType = OmitObjectProperties<ValidateDataModelBaseItem, 'value'>[]

export type ValidateDataModelMatrix = OmitObjectProperties<ValidateDataModelBaseItem, 'value'> & {
  /**
   * 数据是否为矩阵格式
   */
  matrix: true

  /**
   * 矩阵 id
   */
  matrixId: string

  /**
   * 矩阵数据
   */
  value: {
    /**
     * 矩阵列
     * @example 数据格式
     * [
     *   {
     *     dataKey: 'column1',
     *     label: '矩阵列 1'
     *   },
     *   {
     *     dataKey: 'column2',
     *     label: '矩阵列 2'
     *   }
     * ]
     */
    columns: MatrixColumnsType

    /**
     * 矩阵主体数据
     * @example 数据格式
     * [
     *   {
     *     rowId: 'a',
     *     column1: 1,
     *     column2: 'value'
     *   },
     *   {
     *     rowId: 'b',
     *     column1: 22,
     *     column2: 'xxx'
     *   }
     * ]
     */
    data: Array<{
      /**
       * 数据每行对应的 id
       */
      rowId: string

      /**
       * 当前矩阵
       */
      [key: string]: any
    }>
  }
}

export type ValidateDataModelItem = ValidateDataModelBaseItem | ValidateDataModelMatrix

/**
 * 校验数据模型
 * @example 数据示例
 * [
 *   {
 *     value: 'xxx',
 *     label: '名称',
 *     dataKey: 'field1'
 *   },
 *   {
 *     value: 'xxx',
 *     label: '名称',
 *     dataKey: 'field2'
 *   }
 * ]
 */
export type ValidateDataModel = Array<ValidateDataModelItem>

/**
 * 所有内置的规则
 */
export type RuleNames =
  | 'required'
  | 'length'
  | 'min_length'
  | 'max_length'
  | 'email'
  | 'min'
  | 'max'
  | 'number'
  | 'integer'
  | 'float'
  | 'between'
  | 'confirmed'
  | 'alpha'
  | 'alpha_num'
  | 'alpha_spaces'
  | 'url'

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
export type ValidatorRuleModel = OmitObjectProperties<SingleRuleType, 'validator'> & {
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

/**
 * 当前校验上下文对象
 */
export type ValidateContextType = {
  /**
   * 当前校验的所有数据
   */
  data: Readonly<Array<ValidateDataModelItem>>

  /**
   * 当前校验数据的 map 结构，与 data 等价
   */
  dataKeyMap: Map<string, ValidateDataModelItem>
}

/**
 * 规则参数
 * @example
 * between:2,8
 */
export type RuleParamsType = string | string[] | undefined

/**
 * 单个规则类型
 */
export type SingleRuleType<TValue = unknown, TP = RuleParamsType> = {
  validator: ValidatorHandlerType<TValue, TP>

  /**
   * 参数枚举
   * @example
   * [
   *  { name: 'max' }
   * ]
   */
  paramsEnum?: Array<{
    name: string
  }>
}

/**
 * 校验方法
 * @param value 当前值
 * @param ruleParams 当前校验规则的值
 * @param context
 */
export type ValidatorHandlerType<TValue = unknown, TP = RuleParamsType> = (
  value: TValue,
  options: ValidateContextType & {
    /**
     * 链接字段
     */
    linkField?: string | string[]

    /**
     * 规则参数
     */
    ruleValue?: TP
  }
) => boolean | Promise<boolean>

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
