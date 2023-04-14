import path from 'node:path'
import fs from 'node:fs'
import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default function buildRules() {
  return {
    name: 'build-rules',
    async buildEnd() {
      const rulesDir = path.join(__dirname, 'src/rules')
      const files = fs.readdirSync(rulesDir)
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i].replace(/\.ts$/, '')
        const bundle = await rollup({
          input: path.join(rulesDir, files[i]),
          external: ['javascriptUtils'],
          plugins: [
            nodeResolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.rules.json' }),
            babel({
              exclude: './node_modules/**',
              babelHelpers: 'runtime'
            }),
            terser({
              compress: {
                drop_console: process.env.NODE_ENV === 'prod'
              }
            })
          ]
        })
        bundle.write({
          file: `rules/esm/${fileName}.js`,
          format: 'es'
        })
        bundle.write({
          file: `rules/cjs/${fileName}.js`,
          format: 'cjs',
          name: `validator${fileName}Rule`,
          exports: 'named'
        })
        bundle.write({
          file: `rules/umd/${fileName}.js`,
          format: 'umd',
          name: `validator${fileName}Rule`,
          exports: 'named'
        })
      }
    }
  }
}
