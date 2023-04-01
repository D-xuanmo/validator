export const emailRule = (value: string) => {
  if (!value) return true
  return /^(\w+|\w+(\.\w+))+@(\w+\.)+\w+$/.test(value)
}
