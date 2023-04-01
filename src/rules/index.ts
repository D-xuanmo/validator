import { RuleNames } from '../types'
import { requiredRule } from './required'
import { emailRule } from './email'
import { lengthRule } from './length'
import { maxRule } from './max'
import { minRule } from './min'

const rules: Record<RuleNames, any> = {
  required: requiredRule,
  email: emailRule,
  length: lengthRule,
  max: maxRule,
  min: minRule
}

export default rules
