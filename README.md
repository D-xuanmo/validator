# Validator 

- 数据集验证工具，主打多个规则以管道符模式进行串行校验，常用于表单数据繁琐的校验，可完美与后端返回校验配置。
- 规则快速预览： `required|email|length:8`


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
  name: 'xuanmo',
  rules: 'required|max:5'
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

## 单例模式

```typescript
import { Validator } from '@xuanmo/validator'
import zhCN from '@xuanmo/validator/locale/zh-CN.json'
const validator = new Validator()
validator.localize(zhCN)
```

## License

- 本项目基于 [MIT](./LICENSE) 协议，欢迎有兴趣的朋友一起交流
- Copyright © 2023-PRESENT [D-Xuanmo](https://github.com/D-xuanmo)
