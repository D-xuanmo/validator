export const lengthRule = (value: string, ruleValue: string) => {
  if (!value) return true
  return value.length === +ruleValue
}
