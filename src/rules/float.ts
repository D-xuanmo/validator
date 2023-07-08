import { isFloatNumber } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => isFloatNumber(value)
}

export default rule
