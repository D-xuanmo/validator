import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('integer', async () => {
  await expect(validator.validate([
    {
      dataKey: 'integer1',
      value: 22,
      rules: 'integer'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'integer2',
      value: '3q',
      rules: 'integer'
    },
    {
      dataKey: 'integer3',
      value: 222.22,
      rules: 'integer'
    },
  ])).rejects.toMatchInlineSnapshot(`
    {
      "integer2": "integer2不是一个整数",
      "integer3": "integer3不是一个整数",
    }
  `)
})
