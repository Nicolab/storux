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

let gulp = require('gulp');
let flow = require('gulp-flow');
let {cfg, gp, pipes, utils, envList} = flow;
let {_} = utils;


//----------------------------------------------------------------------------//

if(!cfg.env) {
  throw new Error('Run Gulp with an environment (e.g: APP_ENV=local gulp)');
}


/*----------------------------------------------------------------------------*\
  Config
\*----------------------------------------------------------------------------*/

cfg.files.src.push(
  '!src/*.{js, jsx}',
  '!src/**/*.{js, jsx}'
);

cfg.files.srcWatch.push(
  // copy of cfg.files.src
  '!src/*.{js, jsx}',
  '!src/**/*.{js, jsx}'
);


/*----------------------------------------------------------------------------*\
  Bundles
\*----------------------------------------------------------------------------*/

require('./bundles/js');
require('./bundles/webpack');


/*----------------------------------------------------------------------------*\
  Tasks
\*----------------------------------------------------------------------------*/

// generic tasks
gulp.task('clean.public', function() {
  return utils.del(cfg.publicDir);
});

// build: files
gulp.task('build.files', function() {
  return gulp.src(cfg.files.src)
    .pipe(gp.newer(cfg.publicDir))
    .pipe(gp.using())
    .pipe(gulp.dest(cfg.publicDir))
  ;
});

// build: JS with runtime
gulp.task('build.js.with-runtime', function() {
  return gulp.src(cfg.webpack.entry.main)
    .pipe(gp.using())
    .pipe(gp.webpack(cfg.webpack))
    .pipe(gp.rename('storux-with-runtime.js'))
    .pipe(gp.ifElse(envList.NODE_ENV === 'production', pipes.jsMin))
    .pipe(gulp.dest(cfg.publicJsDir))
  ;
});

// build: JS without runtime
gulp.task('build.js', function() {
  let webpackCfg = _.cloneDeep(cfg.webpack);

  webpackCfg.module.loaders[0].query.plugins = [];

  return gulp.src(webpackCfg.entry.main)
    .pipe(gp.using())
    .pipe(gp.webpack(webpackCfg))
    .pipe(gp.rename('storux.js'))
    .pipe(gp.ifElse(envList.NODE_ENV === 'production', pipes.jsMin))
    .pipe(gulp.dest(cfg.publicJsDir))
  ;
});


/*----------------------------------------------------------------------------*\
  Tasks groups
\*----------------------------------------------------------------------------*/

gulp.task('build', gulp.series(
  'clean.public',
  'build.files',
  'build.js',
  'build.js.with-runtime'
));


// load env tasks
require('./env/' + cfg.env);
