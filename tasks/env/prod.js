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
let {cfg} = flow;


//----------------------------------------------------------------------------//

flow.ensureEnv('prod');


/*----------------------------------------------------------------------------*\
  Tasks
\*----------------------------------------------------------------------------*/

// no specific task


/*----------------------------------------------------------------------------*\
  Tasks groups
\*----------------------------------------------------------------------------*/

// default env task
gulp.task(cfg.env, gulp.series('build'));
