import { RuleParamsType, SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown, params: RuleParamsType) => {
    if (!value) return true
    return (value as string).length === +(params as string)
  }
}

export default rule
