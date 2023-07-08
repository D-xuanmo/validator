import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('number', async () => {
  await expect(validator.validate([
    {
      dataKey: 'number1',
      value: 22,
      rules: 'number'
    },
    {
      dataKey: 'number2',
      value: 22.22,
      rules: 'number'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'number3',
      value: '3q',
      rules: 'number'
    },
  ])).rejects.toMatchSnapshot()
})
