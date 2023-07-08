import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('max', async () => {
  await expect(validator.validate([
    {
      dataKey: 'max1',
      value: 2,
      rules: 'max:5'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'max2',
      value: 18,
      rules: 'max:5'
    }
  ])).rejects.toMatchInlineSnapshot(`
    {
      "max2": "max2不能大于5",
    }
  `)
})
