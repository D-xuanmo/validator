export const lengthRule = (value: string, ruleValue: number) => {
  if (!value) return true
  return value.length === +ruleValue
}
