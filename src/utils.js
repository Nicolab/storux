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

let Scope, Store;

let utils = {
  clone(target, ...sources) {
    sources.forEach((source) => {
      let descriptors = Object.keys(source).reduce((descriptors, key) => {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        return descriptors;
      }, {});

      // By default, Object.assign copy the enumerable symbols
      Object.getOwnPropertySymbols(source).forEach((sym) => {
        let descriptor = Object.getOwnPropertyDescriptor(source, sym);

        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });

      Object.defineProperties(target, descriptors);
    });

    return target;
  },

  isEquival(a, b) {
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    let aPropsLn = aProps.length;
    let bPropsLn = bProps.length;

    // If number of properties is different,
    // objects are not equivalent
    if (aPropsLn !== bPropsLn) {
      return false;
    }

    for (let i = 0; i < aPropsLn; i++) {
      let propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  },

  /**
   * Capitalizes the first letter.
   * @param {string} str
   * @return {string}
   */
  ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  },

  /**
   * Lowercase the first letter.
   * @param {string} str
   * @return {string}
   */
  lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substr(1);
  },

  handlerNameToActionName(str) {
    return utils.lcFirst(str.substring(2));
  },

  /**
   * Generate a conventional store name.
   *
   * @param  {Store}  store
   * @return {string}
   */
  generateStoreName(store) {
    return utils.lcFirst(store.constructor.name);
  },

  getFuncName(fn) {
    return fn.name || /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1];
  },

  defineDisplayName(obj, displayName) {
    Object.defineProperty(obj, 'displayName', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: displayName
    });
  },

  isStore(value) {
    // avoid circular dependencies
    if (!Store) {
      Store = require('./Store');
    }

    return true === value instanceof Store;
  },

  /**
   * Get all the properties of the prototype of `obj` and its parents.
   *
   * @param  {object} obj
   * @param  {object} endProto=Object Object that interrupts the proto escalation.
   * @param  {array}  props=[] Initial properties.
   * @return {array} Properties list.
   */
  getProtoProps(obj, endProto = Object, props = []) {
    if (obj === endProto) {
      return props;
    }

    return utils.getProtoProps(
      obj.__proto__,
      endProto,
      props.concat(Object
        .getOwnPropertyNames(obj.prototype)
        .filter((prop) => props.indexOf(prop) === -1)
      )
    );
  },

  /**
   * @param  {Store}  store Store class or Store instance.
   * @return {array}
   */
  getStoreProtoProps(store) {
    return utils.getProtoProps(
      utils.isStore(store) ? store.constructor : store,
      Store
    );
  }
};

module.exports = utils;
