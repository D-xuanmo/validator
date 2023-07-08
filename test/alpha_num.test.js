import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('alpha_num', async () => {
  // 校验通过
  await expect(validator.validate([
    {
      dataKey: 'alpha_num1',
      value: 'abc',
      rules: 'alpha_num'
    },
    {
      dataKey: 'alpha_num2',
      value: 'abc1',
      rules: 'alpha_num'
    },
  ])).resolves.toBe(true)

  // 校验未通过
  await expect(validator.validate([
    {
      dataKey: 'alpha_num3',
      value: 'abc_1',
      rules: 'alpha_num'
    },
    {
      dataKey: 'alpha_num4',
      value: '错误',
      rules: 'alpha_num'
    },
  ])).rejects.toMatchInlineSnapshot(`
    {
      "alpha_num3": "alpha_num3只能包含字母数字字符",
      "alpha_num4": "alpha_num4只能包含字母数字字符",
    }
  `)
})
