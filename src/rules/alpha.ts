import { SingleRuleType } from '../types'

export const alpha: SingleRuleType = {
  validator: (value: unknown) => /^[a-z]*$/i.test(value as string)
}
