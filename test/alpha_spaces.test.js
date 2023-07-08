import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('alpha_spaces', async () => {
  // 校验通过
  await expect(validator.validate([
    {
      dataKey: 'alpha_spaces1',
      value: 'abc',
      rules: 'alpha_spaces'
    },
    {
      dataKey: 'alpha_spaces2',
      value: 'abc d',
      rules: 'alpha_spaces'
    },
  ])).resolves.toBe(true)

  // 校验未通过
  await expect(validator.validate([
    {
      dataKey: 'alpha_spaces3',
      value: 'abc_1',
      rules: 'alpha_spaces'
    },
    {
      dataKey: 'alpha_spaces4',
      value: '错误',
      rules: 'alpha_spaces'
    },
  ])).rejects.toMatchSnapshot()
})
