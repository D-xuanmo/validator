import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('max_length', async () => {
  await expect(validator.validate([
    {
      dataKey: 'length1',
      value: 'xuanmo',
      rules: 'max_length:6'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'length2',
      value: ' 123456789',
      rules: 'max_length:8'
    }
  ])).rejects.toMatchInlineSnapshot(`
    {
      "length2": "length2长度不能大于8",
    }
  `)
})
