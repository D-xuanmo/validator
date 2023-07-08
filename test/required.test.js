import { expect, test } from 'vitest'
import { validator } from '../dist/validator.esm'
import zhCN from '../locale/zh-CN.json'

validator.localize(zhCN)

test('required', async () => {
  // 校验通过
  await expect(validator.validate([
    {
      dataKey: 'required1',
      value: 'required',
      rules: 'required'
    }
  ])).resolves.toBe(true)

  // 校验未通过
  await expect(validator.validate([
    {
      dataKey: 'required2',
      value: '',
      rules: 'required'
    }
  ])).rejects.toMatchInlineSnapshot(`
    {
      "required2": "required2不能为空",
    }
  `)
})
