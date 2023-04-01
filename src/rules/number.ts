import { isNumber } from '@xuanmo/javascript-utils'
import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => isNumber(value)
}

export default rule
