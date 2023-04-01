import { isInteger } from '@xuanmo/javascript-utils'
import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => isInteger(value)
}

export default rule
