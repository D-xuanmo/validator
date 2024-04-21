import { SingleRuleType } from '../types'

export const confirmed: SingleRuleType<unknown, string> = {
  validator(value, { linkField, dataKeyMap }) {
    if (!value) return true

    const target = dataKeyMap.get(linkField as string)

    return value === target?.value
  }
}
