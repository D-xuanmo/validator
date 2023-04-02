# Validator [![Node.js CI](https://github.com/D-xuanmo/validator/actions/workflows/node.js.yml/badge.svg)](https://github.com/D-xuanmo/validator/actions/workflows/node.js.yml)

## 简介

- `Validator` 是数据集验证工具，主打多个规则以管道符模式进行串行校验，常用于表单数据繁琐的校验
- 用最少的代码，解决繁琐的事情
- 支持校验规则扩展、单例模式、异步校验、国际化
- 完善的 `TypeScript` 类型
- 打包后体积约 `6.5 KB`，Gzip 后体积约 `2.5 KB`
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

- [在线编辑 https://uoo.ink/2d906hs](https://uoo.ink/2d906hs) 与 [Element-plus](https://uoo.ink/jkgm4q) 表单结合使用

```typescript
import validator from '@xuanmo/validator'

// 默认不注册多语言，需要引入多语言文件自行注册
import zhCN from '@xuanmo/validator/locale/zh-CN.json'

// 注册多语言
validator.localize(zhCN)

// 执行校验
validator
  .validate({
    name: {
      value: 'xuanmo',
      rules: 'required|max:5'
    },
    age: {
      value: 18,
      required: true,
      rules: 'max:8'
    },
    scope: {
      value: '',
      message: '局部校验规则失败',
      validator() {
        return false
      }
    }
  })
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
validator.validate({
  name: {
    value: 'xuanmo',
    rules: 'length:5'
  }
})
```

### validate 执行校验

```typescript
import validator from '@xuanmo/validator'
validator.validate({
  name: {
    value: 'xuanmo',
    rules: 'length:5|between:2,8'
  },
  scope: {
    value: 'xuanmo',
    // 局部校验规则，优先级最高，不会执行 rules 模式
    validator(value) {
      return false
    }
  }
})

/**
 * validate TS 类型说明
 * @param data 校验数据
 * @returns Promise<true | ValidateErrorType> 校验通过 resolve(true)，失败在 catch 中获取错误信息
 */
type validate = (data: ValidateDataModel) => Promise<true | ValidateErrorType>;
```

### localize 多语言注册

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
    validator(value, ruleValue) {
      return (value as string).length > +ruleValue!
    }
  }
})
```

### rules 内置规则

- `required` 必填校验
- `email` 邮箱
- `length` 长度，示例：`length:2`
- `min` 最小值，示例：`min:5`
- `max` 最大值，示例：`max:5`
- `number` 数字，包含浮点数、整数
- `float` 浮点数
- `integer` 整数
- `between` 数值区间

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
