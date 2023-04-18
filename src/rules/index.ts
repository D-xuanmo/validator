import { RuleNames, SingleRuleType } from '../types'
import requiredRule from './required'
import emailRule from './email'
import lengthRule from './length'
import maxRule from './max'
import minRule from './min'
import numberRule from './number'
import integerRule from './integer'
import floatRule from './float'
import betweenRule from './between'
import confirmedRule from './confirmed'

const rules: Record<RuleNames, SingleRuleType> = {
  required: requiredRule,
  email: emailRule,
  length: lengthRule,
  max: maxRule,
  min: minRule,
  number: numberRule,
  integer: integerRule,
  float: floatRule,
  between: betweenRule as any,
  confirmed: confirmedRule as any
}

export default rules
