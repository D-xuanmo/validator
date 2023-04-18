import { SingleRuleType } from '../types'

const rule: SingleRuleType = {
  validator: (value: unknown) => /^https?:\/\/(\w+\.)+\w+(:\d+)?(\/|\?.*)?$/i.test(value as string)
}

export default rule
