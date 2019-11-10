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

let test = require('unit.js');

let helpers = {
  catchError(err) {
    console.log('catch error');
    console.error(err);
    console.log(err.stack);
    test.fail(err.toString());
  },

  handlePromise(done, promise) {
    return promise.catch(helpers.catchError).finally(done).done();
  },

  testHasChanged(expected) {
    return (hasChanged) => {
      test
        .value(hasChanged)
          .isBool()
          .isIdenticalTo(expected)
      ;
    };
  }
};

module.exports = helpers;
