import babel from '@rollup/plugin-babel';
// // import filesize from 'rollup-plugin-filesize';
import nodeResolve from "@rollup/plugin-node-resolve";
// // import progress from 'rollup-plugin-progress';
// // import visualizer from 'rollup-plugin-visualizer';
// // import commonjs from 'rollup-plugin-commonjs';
import commonjs from "@rollup/plugin-commonjs";
// // import json from 'rollup-plugin-json';
// import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      // sourcemap: 'inline',
    },
  ],
  plugins: [
    // progress(),
    nodeResolve({
      browser: true,
    }),
    // json(),
    commonjs({
      include: [
        'node_modules/**',
      ],
      exclude: [
        'node_modules/process-es6/**',
      ],
      // namedExports: {
      //   'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
      //   'node_modules/react-dom/index.js': ['render'],
      // },
    }),
    babel({
      babelHelpers: 'runtime',
      babelrc: false,
      // // presets: [['es2015', { modules: false }], 'stage-1', 'react'],
      // // plugins: ['external-helpers'],
      presets: [
        'react-app',
      ],
      // plugins: [
      //   '@babel/plugin-proposal-object-rest-spread',
      //   '@babel/plugin-proposal-optional-chaining',
      //   '@babel/plugin-syntax-dynamic-import',
      //   '@babel/plugin-proposal-class-properties',
      //   'transform-react-remove-prop-types',
      // ],
      exclude: 'node_modules/**',
      // runtimeHelpers: true,
    }),
    // visualizer(),
    // filesize(),
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    // }),
  ],
};

