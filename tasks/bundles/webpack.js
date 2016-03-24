/**
 * This file is part of storux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code
 * or visit https://github.com/Nicolab/storux
 */
'use strict';

let flow = require('gulp-flow');

// load webpack bundle
require('gulp-flow-webpack');

let {cfg, utils, envList} = flow;
let {webpack} = utils;

// ignore JS(X) in files tasks
cfg.files.src.push(
  '!src/*.{js,jsx}',
  '!src/**/*.{js,jsx}'
);

cfg.files.srcWatch.push(
  '!src/*.{js,jsx}',
  '!src/**/*.{js,jsx}'
);

cfg.webpack.entry.main = './src/index.js';
cfg.webpack.output.libraryTarget = 'umd';
cfg.webpack.output.library = 'Storux';

cfg.webpack.plugins = [
  new webpack.IgnorePlugin(/_[a-z-A-Z0-9-]\//),

  new webpack.DefinePlugin({
    get __ENV() {
      return `"${cfg.env}"`; // JSON: "string"
    },

    get __NODE_ENV() {
      return `"${envList.NODE_ENV}"`; // JSON: "string"
    },

    get __VERSION() {
      return `"${cfg.pkg.version}"`; // JSON: "string"
    }
  }),

  new webpack.optimize.DedupePlugin(),
  new webpack.NoErrorsPlugin()
];


/*----------------------------------------------------------------------------*\
  ENV: specific
\*----------------------------------------------------------------------------*/

if(envList.NODE_ENV === 'production') {
  cfg.webpack.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
}
