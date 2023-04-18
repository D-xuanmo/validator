import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => /^[a-z]*$/i.test(value as string)
}

export default rule
