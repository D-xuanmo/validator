# Validator

[![Node.js CI](https://github.com/D-xuanmo/validator/actions/workflows/build.yml/badge.svg)](https://github.com/D-xuanmo/validator/actions/workflows/build.yml)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40xuanmo%2Fvalidator)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40xuanmo%2Fvalidator)

## 简介

- `Validator` 是数据集验证工具，主打多个规则以管道符模式进行串行校验，常用于表单数据繁琐的校验
- 用最少的代码，解决繁琐的事情
- 支持校验规则扩展、单例模式、异步校验、国际化
- 完善的 `TypeScript` 类型
- 规则快速预览： `required|email|length:8|between:2,8`

## 安装

```bash
# npm
$ npm i @xuanmo/validator

# yarn
$ yarn add @xuanmo/validator

# pnpm
$ pnpm add @xuanmo/validator
```

## 使用

- [在线编辑](https://uoo.ink/Form) 与 [DLUI](https://www.xuanmo.xin/-/dl-ui/components/form) 表单结合使用
- [在线编辑](https://uoo.ink/2d906hs) 与 [Element-plus](https://uoo.ink/jkgm4q) 表单结合使用

```typescript
import validator from '@xuanmo/validator'

// 默认不注册国际化词条，需要引入国际化词条文件自行注册
import zhCN from '@xuanmo/validator/locale/zh-CN.json'

// 注册国际化词条
validator.localize(zhCN)

// 执行校验
validator
  .validate([
    {
      dataKey: 'name',
      value: 'xuanmo',
      rules: 'required|max:5'
    },
    {
      dataKey: 'age',
      value: 18,
      required: true,
      rules: 'max:8'
    },
    {
      dataKey: 'scope',
      value: '',
      message: '局部校验规则失败',
      validator() {
        return false
      }
    },
    // 以下为矩阵校验示例
    {
      // 需要指定为矩阵校验
      matrix: true,
      // 矩阵对应的 id，整个校验数据唯一
      matrixId: 'matrixId',
      value: {
        columns: [
          {
            dataKey: 'column1',
            label: '矩阵列 1',
            rules: 'required|min_length:9'
          },
          {
            dataKey: 'column2',
            label: '矩阵列 2',
            rules: 'confirmed:@column1'
          }
        ],
        data: [
          {
            rowId: 'a',
            column2: '222value'
          },
          {
            rowId: 'b',
            column1: 22,
            column2: 'xxx'
          }
        ]
      }
    }
  ])
  .then(() => {
    console.log('校验通过')
  })
  .catch((error) => {
    console.log(error)
  })
```

## API

### 关键词说明

#### message

- `{#field}` 会被替换为当前字段
- `{meta}` 具体规则的值
- `ruleParams` 多个值通过 `,` 逗号分隔

```typescript
// 以 `length` 规则为例，错误信息定义：{#field}长度必须为:{length}
// 最终执行结果被替换为：name长度必须为:5
validator.validate([
  {
    dataKey: 'name',
    value: 'xuanmo',
    rules: 'length:5'
  }
])
```

### validate 执行校验

```typescript
import validator from '@xuanmo/validator'

validator.validate([
  {
    dataKey: 'name',
    value: 'xuanmo',
    rules: 'length:5|between:2,8'
  },
  {
    dataKey: 'scope',
    value: 'xuanmo',
    // 局部校验规则，优先级最高，不会执行 rules 模式
    validator(value) {
      return false
    }
  }
])
```

#### Rule 结构说明

|键名|说明|类型|
|---|---|---|
|value|(必须)当前被校验的数据|`unknown`|
|required|(非必须)是否必填，与 `rules` 中的 `required` 等价|`boolean`|
|rules|(非必须)校验规则，以管道符分隔，冒号后边的为校验规则值|`string`|
|label|(非必须)用于覆盖 `message {#field}` 标识|`string`|
|regexp|(非必须)正则校验，一般只有全局中无匹配规则时使用|`RegExp \| string`|
|matrix|(非必须)是否为矩阵数据|`boolean`|
|matrixId|(非必须)矩阵 id|`string`|
|rowId|(非必须)数据每行对应的 id|`string`|
|message|(非必须)校验错误提示信息，权重最高，一般不使用|`string`|
|validator|(非必须)校验函数权重高于 `rules`，一般只有全局中无匹配规则时使用|`ValidatorHandlerType`|

#### TS 类型

```typescript
/**
 * 执行校验
 * @param data 校验数据
 * @param options
 */
type ValidateType = (
  data: ValidateDataModel,
  options?: {
    // 是否执行全部规则的校验，默认为 true，如果字段较多，存在多个异步校验，不建议开启
    checkAll?: boolean;
  }
) => ValidateReturnType;
```

#### 校验权重说明

> required > regexp > validator > rules

#### message 字段权重说明

> validate.field.message > rule.message

### localize 国际化词条注册

```typescript
import zhCN from '@xuanmo/validator/locale/zh-CN.json'

validator.localize(zhCN)
```

### 注册校验规则

#### extend 单个注册

```typescript
validator.extend('custom', {
  message: '{#field}自定义校验规则失败：{custom}',
  validator(value, ruleValue) {
    return (value as string).length > +ruleValue!
  }
})
```

#### extends 多个规则同时注册

```typescript
validator.extends({
  regexp: {
    message: '正则校验失败信息',
    regexp: '\\d+'
  },
  custom: {
    message: '{#field}自定义校验规则失败：{custom}',
    // 可返回 Promise<boolean>
    validator(value, ruleValue) {
      return (value as string).length > +ruleValue!
    }
  }
})
```

### rules 内置规则

> 更多规则可以从 `@xuanmo/validator/rules/{type}/*.js` 导出进行注册，默认不打包

- `required` 必填校验
- `email` 邮箱
- `length` 长度，示例：`length:2`
- `min_length` 最小长度，示例：`min_length:2`
- `max_length` 最大长度，示例：`max_length:2`
- `min` 最小值，示例：`min:5`
- `max` 最大值，示例：`max:5`
- `number` 数字，包含浮点数、整数
- `float` 浮点数
- `integer` 整数
- `between` 数值区间
- `confirmed` 二次确认，如密码场景，示例：`confirmed:@target`
- `alpha` 只能包含字母
- `alpha_num` 只能包含字母数字
- `alpha_spaces` 只能包含字母空格
- `url` URL

## 单例模式

```typescript
import { Validator } from '@xuanmo/validator'
import zhCN from '@xuanmo/validator/locale/zh-CN.json'

const validator = new Validator()
validator.localize(zhCN)
// ...
```

## 鸣谢

> Validator 的成长，离不开前辈的作品

- 感谢 [vee-validate](https://github.com/logaretm/vee-validate) 提供的管道符校验模式

## License

- 本项目基于 [MIT](./LICENSE) 协议，欢迎有兴趣的朋友一起交流
- Copyright © 2023-PRESENT [D-Xuanmo](https://github.com/D-xuanmo)
