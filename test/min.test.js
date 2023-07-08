import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('min', async () => {
  await expect(validator.validate([
    {
      dataKey: 'min1',
      value: 22,
      rules: 'min:2'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'min2',
      value: 1,
      rules: 'min:5'
    }
  ])).rejects.toMatchInlineSnapshot(`
    {
      "min2": "min2不能小于5",
    }
  `)
})
