import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => /^[a-z\d]*$/i.test(value as string)
}

export default rule
