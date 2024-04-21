import { SingleRuleType } from '../types'

export const email: SingleRuleType = {
  validator: (value: unknown) => {
    if (!value) return true
    return /^(\w+|\w+(\.\w+))+@(\w+\.)+\w+$/.test(value as string)
  }
}
