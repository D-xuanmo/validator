import { isFloatNumber } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

export const float: SingleRuleType = {
  validator: (value: unknown) => isFloatNumber(value)
}
