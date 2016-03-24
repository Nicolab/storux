/*! storux v0.5.3 | MIT (c) 2016 Nicolas Tallefourtane - https://github.com/Nicolab/storux */!function(t,n){"object"==typeof exports&&"object"==typeof module?module.a=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.b=n():t.b=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].a;var i=e[r]={a:{},c:r,d:!1};return t[r].call(i.a,i,i.a,n),i.d=!0,i.a}var e={};return n.e=t,n.f=e,n.g="",n(0)}([function(t,n,e){"use strict";function r(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var i=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.h=r.h||!1,r.i=!0,"value"in r&&(r.j=!0),Object.defineProperty(t,r.k,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}(),o=e(4),a=e(2),s=e(1),c=e(3),u=c.l,f=c.m;if(!WeakMap)throw new Error("WeakMap is not supported by this browser. Please use a polyfill (see the Storux doc).");var h=function(){function t(){r(this,t),this.n={},this.o=new o,this.p=new WeakMap,this.q=new WeakMap}return i(t,null,[{k:"isStore",r:function(t){return u(t)}},{k:"mountActionsResolver",r:function(t){var n=f(t).concat(Object.keys(t)),e=t.scope.t.s,r=!0,i=!1,o=void 0;try{for(var a,s=function(){var n=a.r;"function"==typeof t[n]&&e.every(function(t){return 0!==n.indexOf(t)})&&t.scope.mountAction(n)},c=n[Symbol.iterator]();!(r=(a=c.next()).u);r=!0)s()}catch(u){i=!0,o=u}finally{try{!r&&c["return"]&&c["return"]()}finally{if(i)throw o}}}}]),i(t,[{k:"beforeAction",r:function(t,n,e){return this.o.v("beforeAction."+t.w,n,e),this}},{k:"afterAction",r:function(t,n,e){return this.o.v("afterAction."+t.w,n,e),this}},{k:"beforeActions",r:function(t,n){return this.o.v("beforeActions",t,n),this}},{k:"afterActions",r:function(t,n){return this.o.v("afterActions",t,n),this}},{k:"createStore",r:function(n){var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],r=void 0,i=void 0;if(e.x||(e.x=t.x),e.s||(e.s=t.s.slice()),e.y=this,i=new n(e),!u(i))throw new TypeError("Storux.createStore() - `store` argument must be an instance of `Store`");if(r=i.scope.w,this.n[r])throw new Error("The store `"+r+"` is already defined in the `Storux` instance.");return Object.defineProperty(this.n,r,{h:!0,i:!1,j:!1,r:i}),this.o.z("createStore",this.n[r]),this.o.z("createStore."+r,this.n[r]),t.A.forEach(function(t){i.scope[t]=void 0}),i.scope.o.z("init"),this.n[r]}}]),t}();h.s=["on","handle","_","constructor","getState","getPrevState","setState"],h.A=["generateActions","mountAction","mountActions"],t.a={b:h,B:a,C:s,D:o}},function(t,n,e){"use strict";function r(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var i=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.h=r.h||!1,r.i=!0,"value"in r&&(r.j=!0),Object.defineProperty(t,r.k,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}(),s=e(4),c=e(3),u=c.F,f=c.G,h=c.l,l=c.m,v=c.H,p=c.I,y=c.J,d=c.K,g=new WeakMap,b=function(){function t(n){var e=this,i=n.L,o=n.t;r(this,t);var a=void 0;this.y=o.y,o.y=null,this.t=o,this.L=i,this.M=[],this.N=[],this.o=new s,this.O=this.t.O||{},p(this,y(this.L)),a=g.set(this,{P:null,Q:0,R:{},S:this.O}).get(this),this.o.T("init",function(){a.S=e.O})}return a(t,[{k:"beforeAction",r:function(t,n,e){return this.y.o.v("beforeAction."+t.w,n,e),this}},{k:"afterAction",r:function(t,n,e){return this.y.o.v("afterAction."+t.w,n,e),this}},{k:"bindAction",r:function(t,n){var e=void 0,r=v(n),i=this.y.p;if(!this.L[t.w]||this.L[t.w]!==t||!this.L[r]||this.L[r]!==n)throw new Error(r+" cannot bind the action ("+t.c+') from another store. Use instead the method "store.scope.afterAction()". See the doc.');return e=i.get(t),e||(e=i.set(t,[]).get(t)),e.push(n),this}},{k:"bindActions",r:function(t){if(h(t))return this.bindStoreActions(t);for(var n in t){var e=t[n],r=this[n];if(Array.isArray(e))for(var i=0,o=e.length;o>i;i++)this.bindAction(e[i],r);else this.bindAction(e,r)}return this}},{k:"bindStoreActions",r:function(t){var n=l(t),e=!0,r=!1,i=void 0;try{for(var o,a=n[Symbol.iterator]();!(e=(o=a.next()).u);e=!0){var s=o.r;if("function"==typeof t[s]&&0===s.indexOf("on")){var c=d(s),u=t[c];u&&this.bindAction(u,t[s])}}}catch(f){r=!0,i=f}finally{try{!e&&a["return"]&&a["return"]()}finally{if(r)throw i}}return this}},{k:"bindActionHandler",r:function(t,n){var e=this.y.q,r=e.get(t);return r||(r=actionHandlerListenersMap.set(t,[]).get(t)),r.push(n),this}},{k:"generateActions",r:function(){for(var t=this.L,n=0,e=arguments.length;e>n;n++){var r=arguments[n];if(t[r])throw new Error("generateActions(): "+r+"is already defined.");t[r]=function(t,n){return t(n),n}}return this}},{k:"mountAction",r:function(t){var n=this,e=void 0;if(this.L[t]&&this.L[t].c)return this;e=g.get(this);var r=this.L[t],i=function o(){for(var t=arguments.length,i=Array(t),a=0;t>a;a++)i[a]=arguments[a];return new Promise(function(t,a){n.M.push({U:function(){var n=this;e.Q++,e.P=o.c+"#"+e.Q,i=i.slice(),this.y.o.z("beforeAction."+o.w,i),this.y.o.z("beforeActions",{V:o.c,W:o.w,X:i}),i.unshift(function(r){return n._dispatchAction({Y:o,Z:r}).then(function(i){return t(s),e.Q--,e.P=null,n.y.o.z("afterAction."+o.w,r,s,i),n.y.o.z("afterActions",{V:o.c,W:o.w,$:s,Z:r,_:i}),n._next(),i})["catch"](function(t){throw a(t),t})});var s=r.apply(this.L,i)}}),1===n.M.length&&n._next()})["catch"](function(t){throw t})};return p(i,t),i.c=this.w+"."+i.w,i.aa=function(){for(var t=arguments.length,e=Array(t),r=0;t>r;r++)e[r]=arguments[r];return setTimeout(i.apply(n.L,e),0)},this.L[t]=i,this}},{k:"mountActions",r:function(){if(arguments.length){var t=!0,n=!1,e=void 0;try{for(var r,i=arguments[Symbol.iterator]();!(t=(r=i.next()).u);t=!0){var o=r.r;this.mountAction(o)}}catch(a){n=!0,e=a}finally{try{!t&&i["return"]&&i["return"]()}finally{if(n)throw e}}}else this.t.x(this.L);return this}},{k:"_next",r:function(){return this.M.length&&!g.get(this).P?(this.M.shift().U.call(this),!0):!1}},{k:"getHandlerArgs",r:function(t){var n=t.Y,e=t.Z,r=t.ba;return[e,{V:n.c,W:n.w,ba:r}]}},{k:"callActionHandler",r:function(t){var n=t.Y,e=t.ca,r=t.Z,i=t.ba,a=e.apply(this.L,this.getHandlerArgs({Y:n,Z:r,ba:i}));if(!a||"object"!==("undefined"==typeof a?"undefined":o(a)))throw new TypeError('The handler "'+v(e)+'" should return the next state for the action '+n.c);return a}},{k:"reduceActionHandlers",r:function(t,n,e){var r=void 0,i=this.y.q;r=this.getState();for(var a=0,s=t.length;s>a;a++){var c=t[a],u=this.callActionHandler({Y:n,ca:c,Z:e,ba:r});if(u&&"object"===("undefined"==typeof u?"undefined":o(u))){var f=i.get(c);if(r=u,f&&f.length)for(var h=0,l=f.length;l>h;h++)f[h].apply(null,this.getHandlerArgs({Y:n,Z:e,ba:r}))}}return this.setState(r)}},{k:"_dispatchAction",r:function(t){var n=t.Y,e=t.Z,r=this.y.p.get(n);return r&&r.length?Promise.resolve(this.reduceActionHandlers(r,n,e)):Promise.resolve(!1)}},{k:"listen",r:function(t){var n=this;return this.N.push(t),this.o.z("listen",t),function(){return n.unlisten(t)}}},{k:"unlisten",r:function(t){var n=this.N,e=n.indexOf(t);return-1===e?!1:(n.splice(e,1),this.o.z("unlisten",t),!0)}},{k:"getState",r:function(){return u({},g.get(this).S)}},{k:"getPrevState",r:function(){return u({},g.get(this).R)}},{k:"setState",r:function(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=this.N,e=n.length,r=g.get(this);if(f(r.S,t))return!1;if(r.R=r.S,r.S=u({},t),e)for(var i=0;e>i;i++)n[i](this);return!0}},{k:"mergeState",r:function(t){return this.setState(i({},g.get(this).S,t))}},{k:"resetState",r:function(){var t=this.setState(this.O);return t&&this.o.z("resetState"),t}},{k:"recycle",r:function(){var t=this.setState(this.O);return g.get(this).R={},this.o.z("init",t),t}}]),t}();t.a=b},function(t,n,e){"use strict";function r(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var i=e(1),o=function a(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];r(this,a);var n=new i({L:this,t:t});Object.defineProperty(this,"scope",{h:!0,i:!1,j:!1,r:n}),Object.defineProperty(this,"getState",{h:!1,i:!1,j:!1,r:n.getState.bind(n)}),Object.defineProperty(this,"setState",{h:!1,i:!1,j:!1,r:n.setState.bind(n)}),Object.defineProperty(this,"getPrevState",{h:!1,i:!1,j:!1,r:n.getPrevState.bind(n)})};t.a=o},function(t,n,e){"use strict";var r=void 0,i={F:function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;n>r;r++)e[r-1]=arguments[r];return e.forEach(function(n){var e=Object.keys(n).reduce(function(t,e){return t[e]=Object.getOwnPropertyDescriptor(n,e),t},{});Object.getOwnPropertySymbols(n).forEach(function(t){var r=Object.getOwnPropertyDescriptor(n,t);r.h&&(e[t]=r)}),Object.defineProperties(t,e)}),t},G:function(t,n){var e=Object.getOwnPropertyNames(t),r=Object.getOwnPropertyNames(n),i=e.length,o=r.length;if(i!==o)return!1;for(var a=0;i>a;a++){var s=e[a];if(t[s]!==n[s])return!1}return!0},da:function(t){return t.charAt(0).toUpperCase()+t.substr(1)},ea:function(t){return t.charAt(0).toLowerCase()+t.substr(1)},K:function(t){return i.ea(t.substring(2))},J:function(t){return i.ea(t.constructor.name)},H:function(t){return t.name||/^function\s+([\w\$]+)\s*\(/.exec(t.toString())[1]},I:function(t,n){Object.defineProperty(t,"displayName",{h:!0,i:!1,j:!1,r:n})},l:function(t){return r||(r=e(2)),!0==t instanceof r},fa:function(t){var n=arguments.length<=1||void 0===arguments[1]?Object:arguments[1],e=arguments.length<=2||void 0===arguments[2]?[]:arguments[2];return t===n?e:i.fa(t.__proto__,n,e.concat(Object.getOwnPropertyNames(t.prototype).filter(function(t){return-1===e.indexOf(t)})))},m:function(t){return i.fa(i.l(t)?t.constructor:t,r)}};t.a=i},function(t,n){!function(){"use strict";function n(){this.ga={}}n.prototype.v=function(t,n,e){return this.ga[t]||(this.ga[t]=[]),e&&(n.ha=e),this.ga[t].push(n),this},n.prototype.T=function(t,n,e){return n.ia=!0,this.v(t,n,e)},n.prototype.z=function(t,n,e,r,i){var o,a,s,c;if(!this.ga[t])return!1;s=Array.prototype.slice.call(arguments,1),c=s.length,a=this.ga[t];for(var u=0,f=a.length;f>u;u++)switch(o=a[u],o.ia&&this.ja(t,o),c){case 0:o.call(o.ha);break;case 1:o.call(o.ha,n);break;case 2:o.call(o.ha,n,e);break;case 3:o.call(o.ha,n,e,r);break;case 4:o.call(o.ha,n,e,r,i);break;default:o.apply(o.ha,s)}return!0},n.prototype.ja=function(t,n){if(!this.ga[t])return this;for(var e=0,r=this.ga[t].length;r>e;e++)this.ga[t][e]===n&&(this.ga[t][e]=null,delete this.ga[t][e]);return this.ga[t]=this.ga[t].filter(function(t){return"undefined"!=typeof t}),this},n.prototype.ka=function(t){var n,e;if(t)return this.ga[t]||[];n=this.ga,e=[];for(var r in n)e=e.concat(n[r].valueOf());return e},"undefined"!=typeof t&&t.a?t.a=n:window.D=n}()}])});