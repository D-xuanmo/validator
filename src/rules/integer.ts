import { isInteger } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

export const integer: SingleRuleType = {
  validator: (value: unknown) => isInteger(value)
}
