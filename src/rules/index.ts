import { RuleNames } from '../types'
import { requiredRule } from './required'
import { emailRule } from './email'
import { lengthRule } from './length'
import { maxRule } from './max'
import { minRule } from './min'
import { floatRule, integerRule, numberRule } from './number'

const rules: Record<RuleNames, any> = {
  required: requiredRule,
  email: emailRule,
  length: lengthRule,
  max: maxRule,
  min: minRule,
  number: numberRule,
  integer: integerRule,
  float: floatRule
}

export default rules
