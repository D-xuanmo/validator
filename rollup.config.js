import eslint from '@rollup/plugin-eslint'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/main.ts',
  plugins: [
    eslint(),
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({
      exclude: './node_modules/**',
      babelHelpers: 'runtime'
    }),
    terser({
      compress: {
        drop_console: process.env.NODE_ENV === 'prod'
      }
    })
  ],
  output: [
    {
      file: 'dist/validator.esm.js',
      format: 'es',
    },
    {
      file: 'dist/validator.cjs.js',
      format: 'cjs',
      name: 'validator',
      exports: 'named'
    },
    {
      file: 'dist/validator.umd.js',
      format: 'umd',
      name: 'validator',
      exports: 'named'
    }
  ]
}
