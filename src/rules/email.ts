import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => {
    if (!value) return true
    return /^(\w+|\w+(\.\w+))+@(\w+\.)+\w+$/.test(value as string)
  }
}

export default rule
