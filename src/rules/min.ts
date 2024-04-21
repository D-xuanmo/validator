import { isEmpty } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

export const min: SingleRuleType = {
  validator: (value: unknown, { ruleValue }) => {
    if (isEmpty(value)) return true

    return (value as number) > parseFloat(ruleValue as string)
  }
}
