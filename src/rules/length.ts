import { SingleRuleType } from '../types'

export const length: SingleRuleType = {
  validator: (value: unknown, { ruleValue }) => {
    if (!value) return true
    return (value as string).length === +(ruleValue as string)
  }
}
