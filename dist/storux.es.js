/*! storux v0.11.0 | MIT (c) 2021 Nicolas Tallefourtane - https://github.com/Nicolab/storux */
var t=Object.defineProperty,e=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,r=(e,i,s)=>i in e?t(e,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[i]=s,o=(t,o)=>{for(var n in o||(o={}))i.call(o,n)&&r(t,n,o[n]);if(e)for(var n of e(o))s.call(o,n)&&r(t,n,o[n]);return t};function n(t,...e){return e.forEach((e=>{let i=Object.keys(e).reduce((function(t,i){return t[i]=Object.getOwnPropertyDescriptor(e,i),t}),{});Object.getOwnPropertySymbols(e).forEach((function(t){let s=Object.getOwnPropertyDescriptor(e,t);s.enumerable&&(i[t]=s)})),Object.defineProperties(t,i)})),t}function a(t){return"string"==typeof t?t:t.id}function c(t){let e=t.displayName||t.name;return e||(e=/^function\s+([\w$]+)\s*\(/.exec(t.toString()),e?e[1]:null)}function h(t,e){Object.defineProperty(t,"displayName",{enumerable:!0,configurable:!1,writable:!1,value:e})}function l(t){return t instanceof m==!0}const u=require("evemit");function p(){throw new ReferenceError("No action in progress")}class f{constructor({store:t,opt:e}){this.storux=e.storux,e.storux=null,this.opt=e,this.store=t,this.initialState=this.opt.initialState?n({},this.opt.initialState):{},this.clone=n,this.dispatch=p,this._lc=new u,this.on=this._lc.on.bind(this._lc),this.once=this._lc.once.bind(this._lc),this.off=this._lc.off.bind(this._lc),this.emit=this._lc.emit.bind(this._lc),this.listeners=this._lc.listeners.bind(this._lc),h(this,this.opt.displayName?this.opt.displayName:function(t){return(e=t.displayName||c(t.constructor)).charAt(0).toLowerCase()+e.substr(1);var e}(this.store)),this._p={aq:[],ca:null,cl:[]},this.on("init",(()=>{this.dispatch=p,this._p.ca=null,this._p.state=n({},this.initialState)}))}listen(t){if("function"!=typeof t)throw new TypeError(this.displayName+": listener must be a function.");return this._p.cl.push(t),this.emit("listen",t),()=>this.unlisten(t)}unlisten(t){let e=this._p.cl,i=e.indexOf(t);return-1!==i&&(e.splice(i,1),this.emit("unlisten",t),!0)}getState(){return n({},this._p.state)}replaceState(t={}){let e,i;if(function(t,e){let i=Object.getOwnPropertyNames(t),s=Object.getOwnPropertyNames(e),r=i.length;if(r!==s.length)return!1;for(let o=0;o<r;o++){let s=i[o];if(t[s]!==e[s])return!1}return!0}(this._p.state,t))return!1;if(this._p.state=n({},t),e=this._p.cl.length,e){i=this._p.cl;for(let t=0;t<e;t++)"function"==typeof i[t]?i[t](this.store):i.splice(t,1)}return!0}setState(t){return this.replaceState(o(o({},this._p.state),t))}resetState(){let t=this.replaceState(this.initialState);return t&&this.emit("resetState"),t}recycle(){let t=this.replaceState(this.initialState);return this.emit("init",t),t}save(t,e){if(!this.dispatch._action||!this._p.ca)throw new ReferenceError("No action in progress.");if(this.dispatch._action.hooks.length)throw new TypeError("This action have one or more hooks. Use dispatch() instead save().");if("object"!=typeof t)throw new TypeError("save() require an object in "+this.dispatch._action.id);return this.dispatch(e,t)}_dispatcher({resolve:t,action:e,payload:i,obj:s,fnResult:r}){let o;const n=this;if(n.dispatch._inProgress)throw new Error("Dispatching in progress: "+e.id+" The dispatcher must be called only once by action.");return n.dispatch._inProgress=!0,o=e.hooks.length?this._reduceActionHooks(e,i):!!s&&this.setState(s),n.dispatch=p,t(r),n.storux.emit("after."+e.id,i,r,o),n.storux.emit("after",{actionId:e.id,actionName:e.displayName,result:r,payload:i,hasChanged:o}),n._p.ca=null,n._next(),o}_next(){return!(!this._p.aq.length||this.dispatch._action||this._p.ca)&&(this._p.aq.shift()(),!0)}_createActionProxy(t){const e=(...i)=>new Promise((s=>{const r=this;this._p.aq.push((function(){if(r.dispatch._action||r._p.ca)throw new Error(e.id+" can be called, because the action "+r.dispatch._action.id+" is not finished");r.dispatch=function(t,i){return new Promise((function(n){setImmediate((function(){n(r._dispatcher({resolve:s,action:e,payload:t,obj:i,fnResult:o}))}))}))},r.dispatch._action=e,r._p.ca=e.id,i=i.slice(),r.storux.emit("before."+e.id,i),r.storux.emit("before",{actionId:e.id,actionName:e.displayName,actionArgs:i});const o=t.apply(r.store,i)})),1===this._p.aq.length&&this._next()}));return e}_getHandlerArgs({action:t,payload:e,nextState:i}){return[i,e,{actionId:t.id,actionName:t.displayName}]}_reduceActionHooks(t,e){let i=this.getState();for(let s=0,r=t.hooks.length;s<r;s++){let r=t.hooks[s];if("function"!=typeof r)throw new TypeError("The hook must be a function. Hook type: "+typeof r);let o=r.apply(this.store,this._getHandlerArgs({action:t,payload:e,nextState:i}));if(!o||"object"!=typeof o)throw new TypeError('The hook "'+c(r)+'" should return the next state for the action '+t.id);i=o}return this.replaceState(i)}mountAction(t,e){if(this.store[t]&&this.store[t].id)return this;const i=this._createActionProxy(e);h(i,t);let s=c(e);return s&&"function"==typeof this.store[s]&&(this.store[s]=void 0),i.id=this.displayName+"."+i.displayName,i.defer=(...t)=>setImmediate(i.apply(this.store,t)),i.hooks=[],this.store[t]=i,this}mountActions(t){if("object"!=typeof t)throw new ReferenceError("mountActions() requiere one or more actions to mount");for(let e in t)this.mountAction(e,t[e]);return this}ensureActions(){return this._generateActions("dispatch",arguments)}ensureSaveActions(){return this._generateActions("save",arguments)}_generateActions(t,e){let i=this.store;for(let s=0,r=e.length;s<r;s++){let r=e[s];i[r]||(i[r]=function(e){return"save"===t?i.scope.save(e,e):i.scope.dispatch(e),e},this.mountAction(r,i[r]))}return this}}const d=function(t,e,i,s){Object.defineProperty(e,s||i,{enumerable:!1,configurable:!1,writable:!1,value:t[i].bind(t)})};class m{constructor(t={}){let e=new m.Scope({store:this,opt:t});Object.defineProperty(this,"scope",{enumerable:!0,configurable:!1,writable:!1,value:e}),d(e,this,"getState"),d(e,this,"setState"),d(e,this,"replaceState"),this._mount()}_dispatch(t,e){return this.scope.dispatch(t,e)}_save(t,e){return this.scope.save(t,e)}_mount(){let t=[];for(let e in this._mount){let i=this._mount[e];"action"!==i.type?"hook"===i.type&&t.push(i):this.scope.mountAction(i.name,i.fn)}for(let e=0,i=t.length;e<i;e++)this[t[e].actionName].hooks.push(this[t[e].key]);this._mount=void 0}}m.Scope=f;const _=require("evemit");class b{constructor(){this.stores={},this.Store=b.Store,this._lc=new _,this.on=this._lc.on.bind(this._lc),this.once=this._lc.once.bind(this._lc),this.off=this._lc.off.bind(this._lc),this.emit=this._lc.emit.bind(this._lc),this.listeners=this._lc.listeners.bind(this._lc)}create(t,e={}){let i,s;if(e.storux=this,s=new t(e),!l(s))throw new TypeError("Storux.create() - `store` argument must be an instance of `Store`");if(i=s.scope.displayName,this.stores[i])throw new Error("The store `"+i+"` is already defined in the `Storux` instance.");return Object.defineProperty(this.stores,i,{enumerable:!0,configurable:!1,writable:!1,value:s}),this.emit("create",this.stores[i]),this.emit("create."+i,this.stores[i]),b.removeScopePropsAfterCreation.forEach((function(t){s.scope[t]=void 0})),s.scope.emit("init"),this.stores[i]}before(t,e,i){return this.on("before."+a(t),e,i),this}offBefore(t,e){return this.off("before."+a(t),e),this}after(t,e,i){return this.on("after."+a(t),e,i),this}offAfter(t,e){return this.off("after."+a(t),e),this}beforeEach(t,e){return this.on("before",t,e),this}offBeforeEach(t){return this.off("before",t),this}afterEach(t,e){return this.on("after",t,e),this}offAfterEach(t){return this.off("after",t),this}}b.Store=m,b.isStore=l,b.removeScopePropsAfterCreation=["_createActionProxy","_generateActions","ensureActions","ensureSaveActions","mountAction","mountActions"];var y={Storux:b,Store:m,Scope:f,action:t=>function(e,i){e._mount[i]={type:"action",name:t,fn:e[i]}},hook:t=>function(e,i){e._mount[i]={type:"hook",key:i,actionName:t}}};export default y;
