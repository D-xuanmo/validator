import { SingleRuleType } from '../types'

export const min_length: SingleRuleType = {
  validator: (value: unknown, { ruleValue }) => {
    if (!value) return true

    return +(ruleValue as string) <= (value as string).length
  }
}
