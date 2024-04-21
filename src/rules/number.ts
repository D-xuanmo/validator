import { isNumber } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

export const number: SingleRuleType = {
  validator: (value: unknown) => isNumber(value)
}
