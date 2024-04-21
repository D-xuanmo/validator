import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('confirmed', async () => {
  // 校验通过
  console.log(await validator.validate([
    {
      dataKey: 'confirmed1',
      value: '123456'
    },
    {
      dataKey: 'confirmed2',
      value: '123456',
      rules: 'confirmed:@confirmed1'
    }
  ]), 888)
  await expect(validator.validate([
    {
      dataKey: 'confirmed1',
      value: '123456'
    },
    {
      dataKey: 'confirmed2',
      value: '123456',
      rules: 'confirmed:@confirmed1'
    }
  ])).resolves.toBe(true)

  // 校验未通过
  await expect(validator.validate([
    {
      dataKey: 'confirmed3',
      value: '123456',
      label: '密码'
    },
    {
      dataKey: 'confirmed4',
      value: '1',
      rules: 'confirmed:@confirmed3',
      label: '二次确认密码'
    }
  ])).rejects.toMatchInlineSnapshot(`
    {
      "confirmed4": "二次确认密码与密码不匹配",
    }
  `)
})
