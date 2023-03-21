import eslint from '@rollup/plugin-eslint'
import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

const buildFileName = 'validator'

const uglifyOption = {
  compress: {
    pure_funcs: ['console.log']
  }
}

const baseConfig = {
  input: 'src/index.ts',

  plugins: [
    eslint(),
    typescript({ tsconfig: './tsconfig.json' })
  ]
}

export default [
  {
    ...baseConfig,
    output: [
      {
        file: `dist/${buildFileName}.cjs.js`,
        format: 'cjs'
      },
      {
        file: `dist/${buildFileName}.esm.js`,
        format: 'es'
      },
      {
        name: 'JSUtils',
        file: `dist/${buildFileName}.umd.js`,
        format: 'umd'
      }
    ]
  },
  {
    ...baseConfig,
    output: [
      {
        file: `dist/${buildFileName}.cjs.min.js`,
        format: 'cjs',
        plugins: [uglify(uglifyOption)]
      },
      {
        file: `dist/${buildFileName}.esm.min.js`,
        format: 'es',
        plugins: [uglify(uglifyOption)]
      },
      {
        name: 'javascriptUtils',
        file: `dist/${buildFileName}.umd.min.js`,
        format: 'umd',
        plugins: [uglify(uglifyOption)]
      }
    ]
  }
]
