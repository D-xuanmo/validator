import { SingleRuleType } from '../types'

export const alpha_spaces: SingleRuleType = {
  validator: (value: unknown) => /^[a-z\s]*$/i.test(value as string)
}
