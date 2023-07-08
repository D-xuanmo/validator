import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('between', async () => {
  await expect(validator.validate([
    {
      dataKey: 'between1',
      value: 22,
      rules: 'between:0,22'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'between2',
      value: '3q',
      rules: 'between:2,2'
    },
    {
      dataKey: 'between3',
      value: 100,
      rules: 'between:2,20'
    },
  ])).rejects.toMatchInlineSnapshot(`
    {
      "between2": "between2必须在2与2之间",
      "between3": "between3必须在2与20之间",
    }
  `)
})
