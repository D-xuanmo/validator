import { isFloatNumber } from '@xuanmo/javascript-utils'
import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => isFloatNumber(value)
}

export default rule
