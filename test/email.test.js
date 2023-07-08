import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('email', async () => {
  await expect(validator.validate([
    {
      dataKey: 'email1',
      value: 'me@xuanmo.xin',
      rules: 'email'
    }
  ])).resolves.toBe(true)

  await expect(validator.validate([
    {
      dataKey: 'email2',
      value: 'me',
      rules: 'email'
    }
  ])).rejects.toMatchSnapshot()
})
