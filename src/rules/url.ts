import { SingleRuleType } from '../types'

export const url: SingleRuleType = {
  validator: (value: unknown) => /^https?:\/\/(\w+\.)+\w+(:\d+)?([?\/]\S*)?$/i.test(value as string)
}
