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

let {cfg} = require('gulp-flow');

require('gulp-flow-js');

cfg.js.jsMin.mangle = true;
cfg.js.jsMin.mangleProperties = true;
cfg.js.jsMin.preserveComments = true;
