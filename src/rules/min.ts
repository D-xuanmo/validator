import { isEmpty } from '@xuanmo/utils'
import { RuleParamsType, SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown, ruleValue: RuleParamsType) => {
    if (isEmpty(value)) return true

    return (value as number) > parseFloat(ruleValue as string)
  }
}

export default rule
