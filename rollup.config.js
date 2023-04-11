import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import * as packageJson from './package.json';

export default [
  {
    input: 'index.jsx',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        globals: {
          react: 'React',
          slate: 'Slate',
          'slate-react': 'SlateReact'
        },
        exports: 'named'
      },
      {
        file: packageJson.module,
        format: 'esm',
        globals: {
          react: 'React',
          slate: 'Slate',
          'slate-react': 'SlateReact'
        },
        exports: 'named'
      }
    ],
    external: [...Object.keys(packageJson.peerDependencies)],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-transform-runtime'],
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx'],
        babelrc: false
      }),
      postcss()
    ]
  }
];

/*
  {
    input: 'index.jsx',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      globals: {
        react: 'React',
        slate: 'Slate',
        'slate-react': 'SlateReact'
      },
      exports: 'named'
    },
    external: [...Object.keys(packageJson.peerDependencies)],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-transform-runtime'],
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx'],
        babelrc: false
      }),
      postcss({
        extract: true,
        modules: true,
        autoModules: true,
        minimize: true,
        sourceMap: false
      })
    ]
  }

  */
