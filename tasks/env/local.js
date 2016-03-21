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

let watched;
let gulp = require('gulp');
let flow = require('gulp-flow');
let {cfg} = flow;

//----------------------------------------------------------------------------//

flow.ensureEnv('local');


/*----------------------------------------------------------------------------*\
  Watch
\*----------------------------------------------------------------------------*/

gulp.task(cfg.env + '.watch', function() {
  // ensure only once execution
  if(watched) {
    throw new Error(cfg.env + '.watch task is already active.');
  }

  watched = true;


  /*------------------------------------------------------------------------*\
    Watchers
  \*------------------------------------------------------------------------*/

  // JS
  gulp.watch(
    './src/**/*.{js,jsx}',
    gulp.series(
      'build.js'
    )
  );

  // files
  gulp.watch(
    cfg.files.srcWatch,
    gulp.series(
      'build.files'
    )
  );
});


/*----------------------------------------------------------------------------*\
  Tasks groups
\*----------------------------------------------------------------------------*/

// default env task
gulp.task(cfg.env, gulp.series(
  'build',
  cfg.env + '.watch'
));
