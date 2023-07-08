import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('alpha', async () => {
  // 校验通过
  await expect(validator.validate([
    {
      dataKey: 'alpha1',
      value: 'abc',
      rules: 'alpha'
    }
  ])).resolves.toBe(true)

  // 校验未通过
  await expect(validator.validate([
    {
      dataKey: 'alpha2',
      value: '1',
      rules: 'alpha'
    },
    {
      dataKey: 'alpha3',
      value: 'a1',
      rules: 'alpha'
    },
    {
      dataKey: 'alpha4',
      value: 'a_1',
      rules: 'alpha'
    },
  ])).rejects.toMatchInlineSnapshot(`
    {
      "alpha2": "alpha2只能包含字母字符",
      "alpha3": "alpha3只能包含字母字符",
      "alpha4": "alpha4只能包含字母字符",
    }
  `)
})
