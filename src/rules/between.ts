import { isEmpty } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

export const between: SingleRuleType<number, string[]> = {
  paramsEnum: [
    { name: 'min' },
    { name: 'max' }
  ],
  validator: (value, { ruleValue = [] }) => {
    if (isEmpty(value)) return true

    return value >= Number(ruleValue[0]) && value <= Number(ruleValue[1])
  }
}
