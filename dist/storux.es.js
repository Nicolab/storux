/*! storux v0.11.3 | MIT (c) 2021 Nicolas Tallefourtane - https://github.com/Nicolab/storux */
var t,e=Object.defineProperty,i=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,n=(t,i,s)=>i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[i]=s,o=(t,e)=>{for(var o in e||(e={}))s.call(e,o)&&n(t,o,e[o]);if(i)for(var o of i(e))r.call(e,o)&&n(t,o,e[o]);return t},a={exports:{}};
/**
 * @name Evemit
 * @description Minimal and fast JavaScript event emitter for Node.js and front-end.
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 * @link https://github.com/Nicolab/evemit
 * @license MIT https://github.com/Nicolab/evemit/blob/master/LICENSE
 */
t=a,function(){function e(){this.events={}}e.prototype.on=function(t,e,i){return this.events[t]||(this.events[t]=[]),i&&(e._E_ctx=i),this.events[t].push(e),this},e.prototype.once=function(t,e,i){return e._E_once=!0,this.on(t,e,i)},e.prototype.emit=function(t,e,i,s,r){var n,o,a,c;if(!this.events[t])return!1;c=(a=Array.prototype.slice.call(arguments,1)).length;for(var h=0,l=(o=this.events[t]).length;h<l;h++)switch((n=o[h])._E_once&&this.off(t,n),c){case 0:n.call(n._E_ctx);break;case 1:n.call(n._E_ctx,e);break;case 2:n.call(n._E_ctx,e,i);break;case 3:n.call(n._E_ctx,e,i,s);break;case 4:n.call(n._E_ctx,e,i,s,r);break;default:n.apply(n._E_ctx,a)}return!0},e.prototype.off=function(t,e){if(!this.events[t])return this;for(var i=0,s=this.events[t].length;i<s;i++)this.events[t][i]===e&&(this.events[t][i]=null,delete this.events[t][i]);return this.events[t]=this.events[t].filter((function(t){return void 0!==t})),this},e.prototype.listeners=function(t){var e,i;if(t)return this.events[t]||[];for(var s in i=[],e=this.events)i=i.concat(e[s].valueOf());return i},t.exports?t.exports=e:window.Evemit=e}();var c=a.exports;function h(t,...e){return e.forEach((e=>{let i=Object.keys(e).reduce((function(t,i){return t[i]=Object.getOwnPropertyDescriptor(e,i),t}),{});Object.getOwnPropertySymbols(e).forEach((function(t){let s=Object.getOwnPropertyDescriptor(e,t);s.enumerable&&(i[t]=s)})),Object.defineProperties(t,i)})),t}function l(t){return"string"==typeof t?t:t.id}function u(t){let e=t.displayName||t.name;return e||(e=/^function\s+([\w$]+)\s*\(/.exec(t.toString()),e?e[1]:null)}function p(t,e){Object.defineProperty(t,"displayName",{enumerable:!0,configurable:!1,writable:!1,value:e})}function f(t){return t instanceof y==!0}function d(){throw new ReferenceError("No action in progress")}class _{constructor({store:t,opt:e}){this.storux=e.storux,e.storux=null,this.opt=e,this.store=t,this.initialState=this.opt.initialState?h({},this.opt.initialState):{},this.clone=h,this.dispatch=d,this._lc=new c,this.on=this._lc.on.bind(this._lc),this.once=this._lc.once.bind(this._lc),this.off=this._lc.off.bind(this._lc),this.emit=this._lc.emit.bind(this._lc),this.listeners=this._lc.listeners.bind(this._lc),p(this,this.opt.displayName?this.opt.displayName:function(t){return(e=t.displayName||u(t.constructor)).charAt(0).toLowerCase()+e.substr(1);var e}(this.store)),this._p={aq:[],ca:null,cl:[]},this.on("init",(()=>{this.dispatch=d,this._p.ca=null,this._p.state=h({},this.initialState)}))}listen(t){if("function"!=typeof t)throw new TypeError(this.displayName+": listener must be a function.");return this._p.cl.push(t),this.emit("listen",t),()=>this.unlisten(t)}unlisten(t){let e=this._p.cl,i=e.indexOf(t);return-1!==i&&(e.splice(i,1),this.emit("unlisten",t),!0)}getState(){return h({},this._p.state)}replaceState(t={}){let e,i;if(function(t,e){let i=Object.getOwnPropertyNames(t),s=Object.getOwnPropertyNames(e),r=i.length;if(r!==s.length)return!1;for(let n=0;n<r;n++){let s=i[n];if(t[s]!==e[s])return!1}return!0}(this._p.state,t))return!1;if(this._p.state=h({},t),e=this._p.cl.length,e){i=this._p.cl;for(let t=0;t<e;t++)"function"==typeof i[t]?i[t](this.store):i.splice(t,1)}return!0}setState(t){return this.replaceState(o(o({},this._p.state),t))}resetState(){let t=this.replaceState(this.initialState);return t&&this.emit("resetState"),t}recycle(){let t=this.replaceState(this.initialState);return this.emit("init",t),t}save(t,e){if(!this.dispatch._action||!this._p.ca)throw new ReferenceError("No action in progress.");if(this.dispatch._action.hooks.length)throw new TypeError("This action have one or more hooks. Use dispatch() instead save().");if("object"!=typeof t)throw new TypeError("save() require an object in "+this.dispatch._action.id);return this.dispatch(e,t)}_dispatcher({resolve:t,action:e,payload:i,obj:s,fnResult:r}){let n;const o=this;if(o.dispatch._inProgress)throw new Error("Dispatching in progress: "+e.id+" The dispatcher must be called only once by action.");return o.dispatch._inProgress=!0,n=e.hooks.length?this._reduceActionHooks(e,i):!!s&&this.setState(s),o.dispatch=d,t(r),o.storux.emit("after."+e.id,i,r,n),o.storux.emit("after",{actionId:e.id,actionName:e.displayName,result:r,payload:i,hasChanged:n}),o._p.ca=null,o._next(),n}_next(){return!(!this._p.aq.length||this.dispatch._action||this._p.ca)&&(this._p.aq.shift()(),!0)}_createActionProxy(t){const e=(...i)=>new Promise((s=>{const r=this;this._p.aq.push((function(){if(r.dispatch._action||r._p.ca)throw new Error(e.id+" can be called, because the action "+r.dispatch._action.id+" is not finished");r.dispatch=function(t,i){return new Promise((function(o){setImmediate((function(){o(r._dispatcher({resolve:s,action:e,payload:t,obj:i,fnResult:n}))}))}))},r.dispatch._action=e,r._p.ca=e.id,i=i.slice(),r.storux.emit("before."+e.id,i),r.storux.emit("before",{actionId:e.id,actionName:e.displayName,actionArgs:i});const n=t.apply(r.store,i)})),1===this._p.aq.length&&this._next()}));return e}_getHandlerArgs({action:t,payload:e,nextState:i}){return[i,e,{actionId:t.id,actionName:t.displayName}]}_reduceActionHooks(t,e){let i=this.getState();for(let s=0,r=t.hooks.length;s<r;s++){let r=t.hooks[s];if("function"!=typeof r)throw new TypeError("The hook must be a function. Hook type: "+typeof r);let n=r.apply(this.store,this._getHandlerArgs({action:t,payload:e,nextState:i}));if(!n||"object"!=typeof n)throw new TypeError('The hook "'+u(r)+'" should return the next state for the action '+t.id);i=n}return this.replaceState(i)}mountAction(t,e){if(this.store[t]&&this.store[t].id)return this;const i=this._createActionProxy(e);p(i,t);let s=u(e);return s&&"function"==typeof this.store[s]&&(this.store[s]=void 0),i.id=this.displayName+"."+i.displayName,i.defer=(...t)=>setImmediate(i.apply(this.store,t)),i.hooks=[],this.store[t]=i,this}mountActions(t){if("object"!=typeof t)throw new ReferenceError("mountActions() requiere one or more actions to mount");for(let e in t)this.mountAction(e,t[e]);return this}ensureActions(){return this._generateActions("dispatch",arguments)}ensureSaveActions(){return this._generateActions("save",arguments)}_generateActions(t,e){let i=this.store;for(let s=0,r=e.length;s<r;s++){let r=e[s];i[r]||(i[r]=function(e){return"save"===t?i.scope.save(e,e):i.scope.dispatch(e),e},this.mountAction(r,i[r]))}return this}}const m=function(t,e,i,s){Object.defineProperty(e,s||i,{enumerable:!1,configurable:!1,writable:!1,value:t[i].bind(t)})};class y{constructor(t={}){let e=new y.Scope({store:this,opt:t});Object.defineProperty(this,"scope",{enumerable:!0,configurable:!1,writable:!1,value:e}),m(e,this,"getState"),m(e,this,"setState"),m(e,this,"replaceState"),this._mount()}_dispatch(t,e){return this.scope.dispatch(t,e)}_save(t,e){return this.scope.save(t,e)}_mount(){let t=[];for(let e in this._mount){let i=this._mount[e];"action"!==i.type?"hook"===i.type&&t.push(i):this.scope.mountAction(i.name,i.fn)}for(let e=0,i=t.length;e<i;e++)this[t[e].actionName].hooks.push(this[t[e].key]);this._mount=void 0}}y.Scope=_;class b{constructor(){this.stores={},this.Store=b.Store,this._lc=new c,this.on=this._lc.on.bind(this._lc),this.once=this._lc.once.bind(this._lc),this.off=this._lc.off.bind(this._lc),this.emit=this._lc.emit.bind(this._lc),this.listeners=this._lc.listeners.bind(this._lc)}create(t,e={}){let i,s;if(e.storux=this,s=new t(e),!f(s))throw new TypeError("Storux.create() - `store` argument must be an instance of `Store`");if(i=s.scope.displayName,this.stores[i])throw new Error("The store `"+i+"` is already defined in the `Storux` instance.");return Object.defineProperty(this.stores,i,{enumerable:!0,configurable:!1,writable:!1,value:s}),this.emit("create",this.stores[i]),this.emit("create."+i,this.stores[i]),b.removeScopePropsAfterCreation.forEach((function(t){s.scope[t]=void 0})),s.scope.emit("init"),this.stores[i]}before(t,e,i){return this.on("before."+l(t),e,i),this}offBefore(t,e){return this.off("before."+l(t),e),this}after(t,e,i){return this.on("after."+l(t),e,i),this}offAfter(t,e){return this.off("after."+l(t),e),this}beforeEach(t,e){return this.on("before",t,e),this}offBeforeEach(t){return this.off("before",t),this}afterEach(t,e){return this.on("after",t,e),this}offAfterEach(t){return this.off("after",t),this}}function v(t){return function(e,i){e._mount[i]={type:"action",name:t,fn:e[i]}}}function w(t){return function(e,i){e._mount[i]={type:"hook",key:i,actionName:t}}}b.Store=y,b.isStore=f,b.removeScopePropsAfterCreation=["_createActionProxy","_generateActions","ensureActions","ensureSaveActions","mountAction","mountActions"];export{_ as Scope,y as Store,b as Storux,v as action,w as hook};
