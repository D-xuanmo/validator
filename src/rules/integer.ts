import { isInteger } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => isInteger(value)
}

export default rule
