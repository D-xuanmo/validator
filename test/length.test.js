import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('length', async () => {
  await expect(validator.validate([
    {
      dataKey: 'length1',
      value: 'xuanmo',
      rules: 'length:6'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'length2',
      value: 'me',
      rules: 'length:8'
    }
  ])).rejects.toMatchSnapshot()
})
