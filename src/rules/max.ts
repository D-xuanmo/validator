import { isEmpty } from '@xuanmo/utils'
import { RuleParamsType, SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown, params: RuleParamsType) => {
    if (isEmpty(value)) return true

    return (value as number) < parseFloat(params as string)
  }
}

export default rule
