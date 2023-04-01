import { isFloatNumber, isInteger, isNumber } from '@xuanmo/javascript-utils'

export const numberRule = (value: unknown) => isNumber(value)

export const integerRule = (value: unknown) => isInteger(value)

export const floatRule = (value: unknown) => isFloatNumber(value)
