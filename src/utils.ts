/**
 * This file is part of storux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code
 * or visit https://github.com/Nicolab/storux
 */

import Store from './Store';

export function clone(target, ...sources) {
  sources.forEach((source) => {
    let descriptors = Object.keys(source).reduce(function (_descriptors, key) {
      _descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return _descriptors;
    }, {});

    // By default, Object.assign copy the enumerable symbols
    Object.getOwnPropertySymbols(source).forEach(function (sym) {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);

      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });

    Object.defineProperties(target, descriptors);
  });

  return target;
}

export function isEquival(a: any, b: any): boolean {
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
}

/**
 * Capitalizes the first letter.
 * @param {string} str
 * @return {string}
 */
export function ucFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

/**
 * Lowercase the first letter.
 * @param {string} str
 * @return {string}
 */
export function lcFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.substr(1);
}

// handlerNameToActionName(str) {
//   return utils.lcFirst(str.substring(2));
// },

/**
 * Generate a conventional store name.
 *
 * @param  {Store}  store
 * @return {string}
 */
export function generateStoreName(store: Store): string {
  return lcFirst(store.displayName || getFuncName(store.constructor));
}

export function getActionId(store: Store, action: string | { id: string }): string {
  if (typeof action === 'string') {
    return store.displayName + '.' + action;
  }

  return action.id;
}

export function toId(v: string | { id: string }) {
  return typeof v === 'string' ? v : v.id;
}

export function getFuncName(fn) {
  let fnName = fn.displayName || fn.name;

  if (fnName) {
    return fnName;
  }

  fnName = /^function\s+([\w$]+)\s*\(/.exec(fn.toString());

  return fnName ? fnName[1] : null;
}

export function defineDisplayName(obj: object, displayName: string) {
  Object.defineProperty(obj, 'displayName', {
    enumerable: true,
    configurable: false,
    writable: false,
    value: displayName,
  });
}

export function isStore(value: any) {
  return value instanceof Store === true;
}

/**
 * Get all the properties of the prototype of `obj` and its parents.
 *
 * @param  {object} obj
 * @param  {object} endProto=Object Object that interrupts the proto escalation.
 * @param  {array}  props=[] Initial properties.
 * @return {array} Properties list.
 */
export function getProtoProps(obj: object, endProto: object = Object, props = []) {
  if (obj === endProto) {
    return props;
  }

  return getProtoProps(
    // @ts-ignore
    obj.__proto__,
    endProto,
    props.concat(Object
      // @ts-ignore
      .getOwnPropertyNames(obj.prototype)
      .filter(function (prop) {
        return props.indexOf(prop) === -1;
      })
    )
  );
}

// /**
//  * @param  {Store}  store Store class or Store instance.
//  * @return {array}
//  */
// getStoreProtoProps(store) {
//   return utils.getProtoProps(
//     utils.isStore(store) ? store.constructor : store,
//     Store
//   );
// }
