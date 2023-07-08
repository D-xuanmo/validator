import { isEmpty } from '@xuanmo/utils'
import { SingleRuleType } from '../types'

const rule: SingleRuleType<number, string[]> = {
  paramsEnum: [
    { name: 'min' },
    { name: 'max' },
  ],
  validator: (value, params = []) => {
    if (isEmpty(value)) return true

    return value >= Number(params[0]) && value <= Number(params[1])
  }
}

export default rule
