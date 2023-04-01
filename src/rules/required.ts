import { isEmpty } from '@xuanmo/javascript-utils'

export const requiredRule = (value: unknown) => !isEmpty(value)
