import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => /^https?:\/\/(\w+\.)+\w+(:\d+)?([?\/]\S*)?$/i.test(value as string)
}

export default rule
