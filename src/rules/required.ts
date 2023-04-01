import { isEmpty } from '@xuanmo/javascript-utils'
import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => !isEmpty(value)
}

export default rule
