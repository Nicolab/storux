'use strict';

let gulp = require('gulp');
let {cfg, envList, gp} = require('gulp-flow');


//----------------------------------------------------------------------------//

// consolidate environment
envList.consolidate();

// boot the tasks
require('./tasks/');

// task by default
gulp.task('default', gulp.series(cfg.env));
