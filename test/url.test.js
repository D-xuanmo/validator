import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('url', async () => {
  // 校验通过
  await expect(validator.validate([
    {
      dataKey: 'url1',
      value: 'https://github.com',
      rules: 'url'
    },
    {
      dataKey: 'url2',
      value: 'https://github.com/D-xuanmo/validator',
      rules: 'url'
    },
  ])).resolves.toBe(true)

  // 校验未通过
  await expect(validator.validate([
    {
      dataKey: 'url3',
      value: '22',
      rules: 'url'
    },
  ])).rejects.toMatchSnapshot()
})
