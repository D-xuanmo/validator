import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('float', async () => {
  await expect(validator.validate([
    {
      dataKey: 'float1',
      value: 22.22,
      rules: 'float'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'float2',
      value: '3q',
      rules: 'float'
    },
    {
      dataKey: 'float3',
      value: 222,
      rules: 'float'
    },
  ])).rejects.toMatchSnapshot()
})
