import { SingleRuleType } from '../types'

export const alpha_num: SingleRuleType = {
  validator: (value: unknown) => /^[a-z\d]*$/i.test(value as string)
}
