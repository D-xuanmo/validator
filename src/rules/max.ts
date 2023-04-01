import { isEmpty } from '@xuanmo/javascript-utils'

export const maxRule = (value: number, ruleValue: string) => {
  if (isEmpty(value)) return true
  return value < parseFloat(ruleValue)
}
