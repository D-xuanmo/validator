import { isEmpty } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

export const required: SingleRuleType = {
  validator: (value: unknown) => !isEmpty(value)
}
