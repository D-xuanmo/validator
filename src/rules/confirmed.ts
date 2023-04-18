import { SingleRuleType } from '../types'

const rule: SingleRuleType<unknown, string> = {
  validator(value, ruleParams, context) {
    if (!value) return true

    const target = context?.data?.find((item) => item.name === ruleParams)

    return value === target?.value
  }
}

export default rule
