"meta-objects" in window || (window["meta-objects"] = function(exports, global){
"use strict";
function require(s){ s = s.replace(/^[./]*/, ""); return typeof exports[s] === "function" ? exports : exports[s]; }
!function(){

!function(global, exports){
"use strict";

var FP = Function.prototype,
    OP = Object.prototype,
    AP = Array.prototype,
    RP = RegExp.prototype,
    DP = Date.prototype,

    bindbind = FP.bind.bind(FP.bind),
    callbind = bindbind(FP.call),
    applybind = bindbind(FP.apply),
    calling = callbind(FP.call),
    binding = callbind(FP.bind),
    applying = callbind(FP.apply),

    hasOwn = callbind(OP.hasOwnProperty),

    flatten = applybind(AP.concat),
    concat = callbind(AP.concat),
    map = callbind(AP.map),
    reduce = callbind(AP.reduce),

    create = Object.create,
    define = Object.defineProperty,
    defines = Object.defineProperties,
    describe = getPropertyDescriptor,
    describeAll = getPropertyDescriptors,
    describeAllOwn = getOwnPropertyDescriptors,
    describeOwn = Object.getOwnPropertyDescriptor,
    getProto = Object.getPrototypeOf,
    keys = Object.keys,
    names = getPropertyNames,
    namesOwn = Object.getOwnPropertyNames;

var types = [ Array, Boolean, Date, Function, Number, Object, RegExp, String, WeakMap ];


function Descriptor(type, valueOrGet, readonlyOrSet, hidden, frozen){
  this[type ? 'setAccessors' : 'setValue'](valueOrGet, readonlyOrSet);
  if (hidden)
    this.enumerable = false;
  if (frozen)
    this.configurable = false;
}

Descriptor.VALUE = 0;
Descriptor.ACCESSOR = 1;

Descriptor.prototype = {
  constructor: Descriptor,
  configurable: true,
  enumerable: true,
  setValue: function setValue(value, readonly){
    this.value = value;
    this.writable = !readonly;
  },
  setAccessors: function setAccessors(get, set){
    this.get = get;
    this.set = set;
  }
};

function getValue(d){
  if (d)
    return d.value;
}

function value(v, h, r, f){
  return new Descriptor(0, v, r, h, f);
}

function hiddenValue(v, r, f){
  return new Descriptor(0, v, r, true, f);
}

function accessor(g, s, h, f){
  return new Descriptor(1, g, s, h, f);
}

function hiddenAccessor(g, s, f){
  return new Descriptor(1, g, s, true, f);
}

function isAccessor(desc){
  return isObject(desc) && ('get' in desc || 'set' in desc) && !('value' in desc);
}

function isValue(desc){
  return isObject(desc) && !('get' in desc || 'set' in desc) && 'value' in desc;
}

function isBuiltin(o){
  return types.indexOf(o) > -1;
}

function forEach(o, callback, context, hidden){
  if (context === true)
    hidden = true, context = o;
  else
    context = context || o;

  (hidden === true ? namesOwn : keys)(Object(o)).forEach(function(key){
    callback.call(context, o[key], key, o);
  });
}


function extend(to, from){
  to = Object(to);
  from = Object(from);
  if (isBuiltin(to) || keys(to).length === 0 && names(to) > 0)
    var desc = hiddenValue();
  else
    var desc = value();

  var fromBuiltin = isBuiltin(from);

  if (!fromBuiltin && Array.isArray(from)) {
    from.forEach(function(item){
      if (typeof item === 'function' && item.name) {
        desc.value = item;
        define(to, item.name.replace(/_$/, ''), desc);
      }
    });
  } else {
    (fromBuiltin ? namesOwn : keys)(from).forEach(function(key){
      if (!hasOwn(to, key) && !fromBuiltin || typeof from[key] === 'function') {
        desc.value = from[key];
        define(to, key, desc);
      }
    });
  }
  if (arguments.length > 2)
    extend(to, arguments[2]);
  return to;
}

function make(o, p){
  return p ? extend(create(o), p) : create(o);
}

function clone(o){
  return create(getProto(o), describeAllOwn(o));
}

function isObject(o){
  return o !== null && typeof o === 'object' || typeof o === 'function';
}

function isPrimitive(o){
  return o == null || !(typeof o === 'object' || typeof o === 'function');
}


function setPrototypeOf(o,v){
  if (isObject(o) && isObject(v) || v === null)
    o.__proto__ = v;
  return v;
}

function getPropertyDescriptor(o,n){
  while (isObject(o)) {
    var desc = describeOwn(o,n);
    if (desc)
      return desc;
    o = getProto(o);
  }
  return undefined;
}

function getPropertyNames(o){
  var out = [];
  while (isObject(o)) {
    out.push(namesOwn(o));
    o = getProto(o);
  }
  return unique(flatten([], out));
}

function getOwnPropertyDescriptors(o){
  var out = {};
  namesOwn(o).forEach(function(key){
    out[key] = describeOwn(o, key);
  });
  return out;
}

function getPropertyDescriptors(o){
  var out = {};
  names(o).forEach(function(key){
    out[key] = describe(o, key);
  });
  return out;
}

function allKeys(o){
  var out = [];
  while (isObject(o)) {
    out.push(keys(o));
    o = getProto(o);
  }
  return unique(flatten([], out));
}


function parameters(fn){
  return (fn+='').slice(fn.indexOf('(') + 1, fn.indexOf(')')).split(/\s*,\s*/);
}

function unique(a){
  return keys(reduce(a, function(r,s){ r[s] = 1; return r }, {}));
}

function setHidden(o,n,v){
  return define(o, n, hiddenValue(v));
}


var slice = function(_slice){
  return function slice(a,o,p){
    switch (a.length) {
      case  0: return [];
      case  1: return o ? [] : [a[0]];
      default: return _slice.call(a,o,p);
      case  2: a = [a[0],a[1]];
    }
    return (o || p) ? a.slice(o,p) : a;
  }
}(AP.slice);

var monkeypatch = function(){
  var toString = {
    configurable: true,
    writable: true,
    value: new Function('return function toString(){ return "'+
                        (Object+'').replace(/\n/g,'\\n').replace('Object', '"+this.name+"')+'" }')()
  };

  define(toString.value, 'toString', toString);

  return function monkeypatch(o,v){
    setHidden(o, v.name, v);
    if (typeof v === 'function' && v.toString !== toString.value)
      define(v, 'toString', toString);
    return v;
  }
}();

function stringify(o){
  var stringifier = stringify[brandName(o)] || stringify.Object;
  return stringifier(o);
}

var brandName = function(){
  var brands = {};

  types.forEach(function(Ctor){
    if (hasOwn(Ctor.prototype, 'toString'))
      stringify[Ctor.name] = callbind(Ctor.prototype.toString);
    brands['[object '+Ctor.name+']'] = Ctor.name;
  });

  return function brandName(o){
    var brand = stringify.Object(o);
    return brand in brands ? brands[brand] : brand;
  }
}();


exports.Descriptor = extend(Descriptor, {
  accessor: accessor,
  getValue: getValue,
  hiddenAccessor: hiddenAccessor,
  hiddenValue: hiddenValue,
  isAccessor: isAccessor,
  isValue: isValue,
  value: value,
});

exports.Object = extend(function Object(o){ return o ? global.Object(o) : Object.create(null) }, {
  allKeys: allKeys,
  brandName: brandName,
  extend: extend,
  forEach: forEach,
  getOwnPropertyDescriptors: getOwnPropertyDescriptors,
  getPropertyDescriptor: getPropertyDescriptor,
  getPropertyDescriptors: getPropertyDescriptors,
  getPropertyNames: getPropertyNames,
  hasOwn: hasOwn,
  isObject: isObject,
  isPrimitive: isPrimitive,
  monkeypatch: monkeypatch,
  setHidden: setHidden,
  setPrototypeOf: setPrototypeOf,
  stringify: stringify.Object,
}, Object);

exports.Function = extend({
  applybind: applybind,
  applying: applying,
  bindbind: bindbind,
  binding: binding,
  callbind: callbind,
  calling: calling,
  parameters: parameters,
  stringify: stringify.Function,
}, Function);

exports.Array = extend(function Array(n){ return global.Array.apply(null, global.Array(n)) }, {
  flatten: flatten,
  slice: slice,
  stringify: stringify.Array,
  unique: unique,
}, global.Array);

namesOwn(AP).forEach(function(key){
  if (!exports.Array[key] && typeof AP[key] === 'function')
    exports.Array[key] = callbind(AP[key]);
});

var wrappedNative = new WeakMap;

exports.RegExp = function RegExp(s,t){
  if (!(this instanceof RegExp))
    return new RegExp(s,t);

  wrappedNative.set(this, new global.RegExp(s,t));
}

extend(exports.RegExp, {
  exec: callbind(RP.exec),
  execable: bindbind(RP.exec),
  stringify: stringify.RegExp,
  test: callbind(RP.test),
  testable: bindbind(RP.test),
});

extend(exports.RegExp.prototype, {
  toString: function toString(){
    return exports.RegExp.stringify(wrappedNative.get(this));
  },
  valueOf: function valueOf(){
    return wrappedNative.get(this);
  },
  test: function test(s){
    return exports.RegExp.test(wrappedNative.get(this), s);
  },
  testable: function testable(){
    return exports.RegExp.testable(wrappedNative.get(this));
  },
  exec: function exec(s){
    return exports.RegExp.exec(wrappedNative.get(this), s);
  },
  execable: function execable(){
    return exports.RegExp.execable(wrappedNative.get(this));
  },
  split: function split(s){
    return s.split(wrappedNative.get(this));
  },
  match: function match(s){
    return s.match(wrappedNative.get(this));
  },
  replace: function replace(s,r){
    return s.replace(wrappedNative.get(this), r);
  }
});

exports.Date = extend(function Date(p){ return new (applybind(global.Date, flatten(null, p))) }, {
  stringify: stringify.Date,
});

var wrapped = new WeakMap;

function O(o){
  if (!(this instanceof O))
    return new O(o);
  wrapped.set(this, Object(o));
}

exports.O = extend(O, {
  make: make,
  brand: brandName,
  create: Object.create,
  clone: clone,
  define: Object.defineProperty,
  defines: Object.defineProperties,
  describe: getPropertyDescriptor,
  describeAll: getPropertyDescriptors,
  describeAllOwn: getOwnPropertyDescriptors,
  describeOwn: Object.getOwnPropertyDescriptor,
  each: forEach,
  extend: extend,
  getProto: Object.getPrototypeOf,
  has: hasOwn,
  isObj: isObject,
  keys: Object.keys,
  allKeys: allKeys,
  names: getPropertyNames,
  namesOwn: Object.getOwnPropertyNames,
  notObj: isPrimitive,
  setHidden: setHidden,
  setProto: setPrototypeOf,
  stringify: stringify
});

O.prototype.unwrap = function(){
  return wrapped.get(this);
}

forEach(O, function(fn, key){
  if (typeof fn === 'function') {
    O.prototype[key] = function(){
      return fn.apply(null, flatten(wrapped.get(this), arguments));
    }
  }
});



}(new Function('return this')(), typeof window !== 'undefined' ? (exports.utility = {}) : typeof exports === 'undefined' ? this : exports);

}();

!function(){

var _Object = require('./utility').Object;


function lookup(o){
  if (!wrapmaps.has(o))
    throw new TypeError('WrapMaps are not generic');
  else
    return wrapmaps.get(o);
}


var wrapmaps = new WeakMap;

function WrapMap(wrapper) {
  var wrapped = new WeakMap;
  var unwrapped = new WeakMap;

  if (typeof wrapper === 'function') {
    var wrap = function wrap(o, isDescriptor){
      if (isDescriptor === true)
        return wrapDescriptor(o);
      else if (_Object.isPrimitive(o) || wrapped.has(o))
        return o;
      else if (unwrapped.has(o))
        return unwrapped.get(o);
      else {
        var p = wrapper(o);
        if (_Object.isObject(p)) {
          wrapped.set(p, o);
          unwrapped.set(o, p);
        }
        return p;
      }
    }
  } else {
    var wrap = function wrap(o, p){
      if (_Object.isPrimitive(o) || wrapped.has(o))
        return o;
      else if (unwrapped.has(o))
        return unwrapped.get(o);
      else {
        if (_Object.isObject(p)) {
          wrapped.set(p, o);
          unwrapped.set(o, p);
        }
        return p;
      }
    }
  }

  function unwrap(o, isDescriptor){
    if (isDescriptor === true)
      return unwrapDescriptor(o);
    else if (_Object.isPrimitive(o) || !wrapped.has(o))
      return o;
    else
      return wrapped.get(o);
  }

  function has(o){
    return Object.isObject(o) && wrapped.has(o);
  }

  function remove(o){
    var p = unwrap(o);
    if (o !== p)
      wrapped.delete(o);
    return p;
  }

  function wrapDescriptor(o){
    if (_Object.isObject(o) && !wrapped.has(o)) {
      if (o.value) o.value = wrap(o.value);
      if (o.set) o.set = wrap(o.set);
      if (o.get) o.get = wrap(o.get);
    }
    return o;
  }

  function unwrapDescriptor(o){
    if (_Object.isObject(o) && wrapped.has(o)) {
      if (o.value) o.value = unwrap(o.value);
      if (o.set) o.set = unwrap(o.set);
      if (o.get) o.get = unwrap(o.get);
    }
    return o;
  }


  var self = this === global ? Object.create(WrapMap.prototype) : this;
  self.wrap = wrap;
  self.unwrap = unwrap;
  self.remove = remove;
  self.has = has;

  wrapmaps.set(self, {
    wrap: wrap,
    unwrap: unwrap,
    remove: remove,
    has: has
  });

  return self;
}

// less efficient prototype versions that must first lookup `this`
// allows this to work: `WrapMap.prototype.wrap.call(wrapmapInstance, o)`
WrapMap.prototype = {
  constructor: WrapMap,
  wrap: function wrap(o, p){
    return lookup(this).wrap(o, p);
  },
  unwrap: function unwrap(o){
    return lookup(this).unwrap(o);
  },
  remove: function remove(o){
    return lookup(this).remove(o);
  },
  has: function has(o){
    return lookup(this).has(o);
  },
};

exports.WrapMap = WrapMap;

}();

!function(){

var _Array = require('./utility').Array;


// ### Generic Event ###

function Event(type, target){
  this.type = type;
  this.target = target;
}

function ErrorEvent(error, event, target){
  Event.call(this, 'error', target)
  this.error = error;
  this.event = event;
}


var emitters = new WeakMap;
var receivers = new WeakMap;


function _(o){
  if (!emitters.has(o)) {
    var ret = {};
    receivers.set(o, o);
    emitters.set(o, ret);
    return ret;
  } else {
    return emitters.get(o);
  }
}

// ##############################################
// ### Prototype and initializer for emitters ###
// ##############################################

function Emitter(){
  emitters.set(this, {});
  receivers.set(this, this);
}

Emitter.Event = Event;

// forward on event subscriptions from one object to another
Emitter.forward = function forward(from, to){
  if (!emitters.has(to)) {
    emitters.set(to, {});
    receivers.set(to, to);
  }
  emitters.set(from, emitters.get(to));
  from.on = Emitter.prototype.on.bind(to);
  from.off = Emitter.prototype.off.bind(to);
}


// standardish emitter that is able to be ignorant of QT needs
Emitter.prototype = {
  constructor: Emitter,
  on: function on(events, listener){
    var listeners = _(this);
    events.split(' ').forEach(function(event){
      if (event in listeners){
        listeners[event].push(listener);
      } else {
        listeners[event] = [listener];
      }
    });
  },
  off: function off(events, listener){
    var listeners = _(this);
    events.split(' ').forEach(function(event){
      if (listeners[event]) {
        listeners[event].splice(listeners[event].indexOf(listener), 1);
      }
    });
  },
  offAll: function offAll(event){
    delete _(this)[event];
  },
  once: function once(event, listener){
    var self = this;
    this.on(event, function(){
      self.off(event, listener);
      return listener.apply(receivers.get(self), arguments);
    });
  },
  isListened: function isListened(type){
    var events = _(this);
    var listeners = events[type] || events['*'];
    return Boolean(listeners && listeners.length);
  },
  emit: function emit(type){
    var event, events = _(this);
    if (typeof type !== 'string' && type.type) {
      event = type;
      type = type.type;
    }
    if (events['*']) {
      var listeners = events[type] ? events['*'].concat(events[type]) : events['*'];
    } else {
      var listeners = events[type];
    }
    if (listeners && listeners.length) {
      event = event || new Event(type, receivers.get(this));
      var args = [event].concat(_Array.slice(arguments, 1));
      for (var i=0; i < listeners.length; i++) {
        try {
          listeners[i].apply(this, args);
        } catch (e) {
          this.emit(new ErrorEvent(e, event, listeners[i]));
        }
      }
    }
  }
};


exports.Emitter = Emitter;
exports.Event = Event;

}();

!function(){

var utility = require('./utility');
var _Function = utility.Function;
var _Object = utility.Object;
var _Array = utility.Array;
var O = utility.O;
var Descriptor = utility.Descriptor;


var createProxyObject = Proxy.create,
    createProxyFunction = Proxy.createFunction;

var wmhas = _Function.callbind(WeakMap.prototype.has),
    wmget = _Function.callbind(WeakMap.prototype.get),
    wmset = _Function.callbind(WeakMap.prototype.set),
    wmdelete = _Function.callbind(WeakMap.prototype.delete),
    wmhasget = function hasget(wm, obj){
      return _Object.isObject(obj) && (wm = wmget(wm, obj)) === undefined ? obj : wm;
    };



// ###############################
// ### Monkeypatching Builtins ###
// ###############################

var checkArray = function(){
  var wrapped = new WeakMap,
      isArr = Array.isArray;

  _Object.monkeypatch(Array, function isArray(){
    var a = arguments[0];
    if (isArr(a)) return true;
    if (_Object.isPrimitive(a)) return false;
    return wmhas(wrapped, a);
  });

  return function(o,p){
    if (isArr(o))
      wmset(wrapped, o, true);
  }
}();

var checkToString = function(){
  var wrapped = new WeakMap;

  [Function, RegExp, Object, Date].forEach(function(Ctor){
    var stringify = utility[Ctor.name].stringify;
    function toString(){
      return stringify(wmhasget(wrapped, this));
    }
    wmset(wrapped, toString, Ctor.prototype.toString);
    _Object.monkeypatch(Ctor.prototype, toString)
  });

  return function(o,p){
    wmset(wrapped, p, o);
  }
}();

if (typeof StopIteration === 'undefined') {
  global.StopIteration = O.create(O.create(null));
  _Object.monkeypatch(StopIteration.__proto__, function toString(){
    return '[object StopIteration]';
  });
}

function Iterator(next){
  this.next = next;
}


// ################################
// ### Default Forwarding Traps ###
// ################################

function definer(o, n, v, newDesc){
  o[n] = v;
  return true;
}

function setter(desc, rcvr, val){
  var exists = desc.set != null;
  exists && _Function.calling(desc.set, rcvr, val);
  return exists;
}

function configurable(desc){
  if (desc)
    desc.configurable = true;
  return desc;
}

// ### workaround for V8 bug ###
// var opMap = {};
// O.namesOwn(Object.prototype).forEach(function(name){
//  opMap[name + '_'] = name;
//});

var forwarder = {
  getProto: function getProto(T){
    return O.getProto(T);
  },
  setProto: function setProto(T,V){
    T.__proto__ = V;
    return true;
  },
  describe: function describe(T,N){
    return configurable(O.describeOwn(T,N));
  },
  define: function define(T,N,D){
    O.define(T,N,D);
    return true;
  },
  delete: function delete_(T,N){
    return delete T[N];
  },
  fix: function fix(T){
    return Object.freeze(T);
  },
  keys: function keys(T){
    return O.keys(T);
  },
  names: function names(T){
    return O.namesOwn(T);
    // ### workaround for V8 bug ###
    // return O.namesOwn(T).map(function(s){
    //  return s in Object.prototype ? s + '_' : s;
    // });
  },
  enumerate: function enumerate(T){
    return O.allKeys(T);
  },
  owns: function owns(T,N){
    return O.has(T,N);
  },
  has: function has(T,N){
    return N in T;
  },
  get: function get(T,N,R){
    var handler = wmget(proxies, T);
    if (handler != null)
      return wmget(handler, R,N);

    try {
      // Firefox fails here due to XPConnectWrapper interacting poorly with WeakMap/Proxy
      var desc = O.describeOwn(T,N);
    } catch (e) {
      return unwrap(R)[N];
    }

    if (desc == null) {
      var proto = O.getProto(T);
      if (proto != null)
        return forwarder.get(proto, N, R);// || T[N];
    } else if (Descriptor.isValue(desc))
      return desc.value;
    else if (Descriptor.isAccessor(desc)) {
      if (typeof desc.get === 'function')
        return _Function.calling(desc.get, R);
    }
    return undefined;
  },
  set: function set(T,N,V,R){
    var handler = wmget(proxies, T);
    if (handler)
      // target is a proxy, invoke its setter
      return handler.set(R,N,V);

    try {
      // Firefox fails here due to XPConnectWrapper interacting poorly with WeakMap/Proxy
      var oDesc = O.describeOwn(T,N)
    } catch (e) {
      unwrap(R)[N] = V;
      return true;
    }
    if (oDesc) {
      // existing own desc
      if (Descriptor.isAccessor(oDesc))
        // is an accessor
        return setter(oDesc,R,V);
      else if (!oDesc.writable)
        // is readonly
        return false;
      else
        // set it
        return definer(R,N,V, R !== T);
    } else {
      var proto = O.getProto(T);
      if (proto === null)
        // no proto
        return definer(unwrap(R),N,V,true);
      else
        // recurse to proto
        return forwarder.set(proto,N,V,R);
    }
  },
  apply: function apply(T,A,R){
    return _Function.applying(T,R,A);
  },
  construct: function construct(T,A) {
    var handler = wmget(proxies, T);
    if (handler)
      return handler.construct(T, A);

    var result = new (_Function.applying(Function.bind, T, [null].concat(A)));
    return _Object.isObject(result) ? result : O.create(T.prototype);
  },
  iterate: function iterate(T) {
    var handler = wmget(proxies, T);
    if (handler)
      return handler.iterate(T);

    var enumerables = O.allKeys(T);
    var index = 0;
    return new Iterator(function(){
      if (index === enumerables.length)
        throw StopIteration;
      return enumerables[index++];
    });
  }
};

function unwrap(o){
  return wmget(targets, o) || o;
}

var trapMap = {
  getPrototypeOf: 'getProto',
  setPrototypeOf: 'setProto',
  getOwnPropertyDescriptor: 'describe',
  getOwnPropertyNames: 'names',
  defineProperty: 'define',
  delete: 'delete',
  fix: 'fix',
  keys: 'keys',
  enumerate: 'enumerate',
  iterate: 'iterate',
  hasOwn: 'owns',
  has: 'has',
  get: 'get',
  set: 'set',
  apply: 'apply',
  construct: 'construct',
};


_Object.monkeypatch(Object, function getPrototypeOf(o){
  if (wmhas(proxies, o))
    return wmget(proxies, o).getPrototypeOf();
  else
    return O.getProto(o);
});


// #######################################
// ### proxy creator with meta-handler ###
// #######################################

var proxies = new WeakMap,
    targets = new WeakMap;

function proxy(target, handler, callable){
  if (!_Object.isObject(target))
    throw new TypeError('Target must be an object');
  if (!_Object.isObject(handler))
    throw new TypeError('Handler must be an object');

  function makeFwd(args, trap){
    var fwd = function(){
      return _Function.applying(forwarder[fwd.trap], handler, [fwd.target].concat(fwd.args));
    };
    fwd.target = target;
    fwd.args = args;
    fwd.trap = trap;
    return fwd;
  }

  var metaHandler = createProxyObject({
    get: function get(R, trap){
      if (trap === 'getPropertyDescriptor')
        return function getPropertyDescriptor(n){
          return configurable(get(null, 'getOwnPropertyDescriptor')(n) || O.describe(get(null, 'getPrototypeOf')), n);
        };

      if (trap === 'getPropertyNames')
        return function getPropertyNames(){
          return _Array.unique(get(null, 'getOwnPropertyNames')().concat(O.names(get(null, 'getPrototypeOf'))));
        };

      return function metaget(){
        var args, after;

        if (arguments[0] === '__proto__' || arguments[1] === '__proto__') {
          switch (trap) {
            case 'getOwnPropertyDescriptor':
              after = Descriptor.hiddenValue;
            case 'get':
              args = [];
              trap = 'getProto';
              break;
            case 'set':
              args = [arguments[2]];
              trap = 'setProto';
              break;
            case 'defineProperty':
              args = [Descriptor.getValue(arguments[1])];
              trap = 'setProto';
              break;
          }
        } else if (trap === 'get') {
          args = [arguments[1], arguments[0]];
        } else if (trap === 'set') {
          args = [arguments[1], arguments[2], arguments[0]];
        } else {
          if (!trapMap[trap])
            throw new Error('Unknown trap "'+trap+'"');
          trap = trapMap[trap];
          args = _Array.slice(arguments);
        }

        // ### workaround for V8 bug ###
        // if (typeof args[0] === 'string' && args[0] in opMap)
        //  args[0] = opMap[args[0]];

        var trapHandler = handler[trap];
        if (typeof trapHandler !== 'function')
          var ret = _Function.applying(forwarder[trap], handler, [target].concat(args));
        else
          var ret = _Function.applying(trapHandler, handler, [makeFwd(args, trap), target].concat(args));

        return after ? after(ret) : ret;
      }
    }
  });

  if (callable === true || callable == null && typeof target === 'function') {
    var reflectProxy = createProxyFunction(metaHandler,
      function(){ return metaHandler.apply(_Array.slice(arguments), this) },
      function(){ return metaHandler.construct(_Array.slice(arguments)) }
    );
  } else {
    var reflectProxy = createProxyObject(metaHandler, O.getProto(target));
  }

  wmset(proxies, reflectProxy, metaHandler);
  wmset(targets, reflectProxy, target);

  checkArray(target, reflectProxy);
  checkToString(target, reflectProxy);

  return reflectProxy;
};

exports.proxy = proxy;

}();

!function(){

var _Array = require('./utility').Array;
var _Function = require('./utility').Function;
var _Object = require('./utility').Object;
var proxy = require('./proxy').proxy;
var WrapMap = require('./WrapMap').WrapMap;

var fakehandler = {};

function membrane(handlers){
  if (_Object.isPrimitive(handlers))
    throw new Error('Handlers must be provided');

  var wrapper = new WrapMap(function(target){
    return proxy(target, proxy(fakehandler, {
      get: function membraneHandlerGet(f, t, trap){
        return function membraneMetaHandler(fwd, faketarget){
          var handler = handlers[trap];
          var args = _Array.slice(arguments);
          args[1] = fwd.target = wrapper.unwrap(faketarget);
          if (handler) {
            var origfwd = fwd;
            fwd = function fwd(){
              return _Function.applying(handler, handlers, args);
            };
            fwd.args = origfwd.args;
          }
          return _Function.applying(wrapHandler[trap], null, _Array.concat([fwd], _Array.slice(args, 1)));
        }
      }
    }));
  });

  function forward(fwd){
    return fwd();
  }

  var wrapHandler = {
    names: forward,
    enumerate: forward,
    keys: forward,
    delete: forward,
    owns: forward,
    has: function has(){
      // spidermonkey fails on get/set for proxies as prototypes without this
      return true;
    },
    getProto: function getProto(fwd, target){
      return wrapper.wrap(fwd());
    },
    setProto: function setProto(fwd, target, value){
      fwd.args[0] = wrapper.unwrap(value);
      return wrapper.wrap(fwd());
    },
    fix: function fix(fwd, target){
      throw target;
    },
    define: function define(fwd, target, name, desc){
      wrapper.unwrap(desc, true);
      return fwd();
    },
    describe: function describe(fwd, target, name){
      return wrapper.wrap(fwd(), true);
    },
    get: function get(fwd, target, name, rcvr){
      fwd.args[1] = wrapper.unwrap(rcvr);
      return wrapper.wrap(fwd());
    },
    set: function set(fwd, target, name, val, rcvr){
      fwd.args[1] = wrapper.unwrap(val);
      fwd.args[2] = wrapper.unwrap(rcvr);
      return fwd();
    },
    apply: function apply(fwd, target, args, rcvr){
      fwd.args[0] = _Array.map(args, wrapper.unwrap);
      fwd.args[1] = wrapper.unwrap(rcvr);
      return wrapper.wrap(fwd());
    },
    construct: function construct(fwd, target, args){
      fwd.args[0] = _Array.map(args, wrapper.unwrap);
      return wrapper.wrap(fwd());
    }
  };

  return wrapper;
};

exports.membrane = membrane;

}();

!function(){

var proxy = require('./proxy').proxy;
var _Array = require('./utility').Array;
var _Function = require('./utility').Function;
var O = require('./utility').O;

function multiherit(o){
  o.params = o.params || [];
  var arglist = o.ctors.map(function(ctor, i){
    if (Array.isArray(o.params[i])) {
      return o.params[i]
    } else {
      return _Function.parameters(ctor).map(function(param){
        return o.params.indexOf(param);
      });
    }
  });

  var protos = o.ctors.map(function(ctor){
    return ctor.prototype;
  });

  return new MultiCtor(new Multiproto(protos), arglist, o);
}


function MultiCtor(proto, params, o){
  var ctors = o.ctors;
  function Ctor(){
    var args = arguments;
    for (var i=0; i < ctors.length; i++) {
      _Function.applying(ctors[i], this, params[i].map(function(i){ return args[i] }));
    }
    return this;
  }
  Ctor.prototype = proto;
  proto.constructor = Ctor;
  this.name = o.name || ctors.map(function(ctor){ return ctor.name }).join('');
  this.createInstance = instanceCreator(proto, o.onCall, o.onConstruct);
  return proxy(Ctor, this);
}

function toString(){ return 'function '+this.name+'() { [native code] }' }

MultiCtor.prototype = {
  get: function(fwd, target, name, rcvr){
    if (name === 'name') {
      return this.name;
    } else if (name === 'toString') {
      return toString;
    } else {
      return fwd();
    }
  },
  describe: function(fwd, target, name){
    if (name === 'name') {
      var desc = fwd();
      desc.value = this.name;
      return desc;
    } else {
      return fwd();
    }
  },
  call: function(fwd, target, args, rcvr){
    return this.construct(fwd, target, args);
  },
  construct: function(fwd, target, args){
    return _Function.applying(target, this.createInstance(), args);
  }
};

function instanceCreator(proto, call, construct){
  if (call || construct) {
    var handler = {
      apply: function(fwd, target, args, rcvr){
        return _Function.applying(call, rcvr, args);
      },
      construct: function(fwd, target, args){
        if (construct) {
          return _Function.applying(construct, Object.create(target.prototype), args);
        } else {
          return _Function.applying(call, global, args);
        }
      }
    };
    return function(){
      var fake = function(){};
      fake.__proto__ = proto;
      return proxy(fake, handler);
    }
  } else {
    return function(){
      return Object.create(proto);
    }
  }
}

function Multiproto(protos){
  this.protos = protos = Object.freeze(protos.slice());
  var proto = Object.create(null, { inherits: { configurable: true, value: protos } });
  return proxy(proto, this);
}

Multiproto.prototype = function(){
  function list(fwd, target){
    return _Array.unique(this.protos.reduce(function(ret, proto){
      fwd.target = proto;
      return ret.concat(fwd());
    }, fwd())).filter(function(s){ return !(s in Object.prototype) });
  }

  function has(fwd, target, name){
    if (fwd()) return true;
    for (var i=0; i < this.protos.length; i++) {
      fwd.target = this.protos[i];
      if (fwd()) return true;
    }
    return false;
  }

  return {
    names: list,
    keys: list,
    enumerate: list,
    hasOwn: has,
    has: has,
    describe: function(fwd, target, name){
      var desc = fwd();
      if (desc) return desc;
      for (var i=0; i < this.protos.length; i++) {
        fwd.target = this.protos[i];
        desc = fwd();
        if (desc)
          return desc;
      }
      return undefined;
    },
    get: function(fwd, target, name, rcvr){
      var ret, i=0;
      while (typeof ret === 'undefined' && fwd.target) {
        ret = fwd();
        fwd.target = this.protos[i++];
      }
      return ret;
    }
  };
}();

exports.multiherit = multiherit;

}();

!function(){

var proxy = require('./proxy').proxy;
var membrane = require('./membrane').membrane;
var Emitter = require('./Emitter').Emitter;


function TraceEmitter(object, name){
  var self = this instanceof TraceEmitter ? this : Object.create(TraceEmitter.prototype);

  name = name || 'root';
  Emitter.call(this);
  var wrapper = membrane(proxy({}, {
    get: function get(f,t,trap){
      return function(fwd, target, prop){
        var ret = fwd();
        self.emit(new TraceEvent(trap, target, fwd.args, ret));
        return ret;
      }
    }
  }));

  this.unwrap = wrapper.unwrap;
  this[name] = wrapper.wrap(object);
}

TraceEmitter.prototype = Object.create(Emitter.prototype);
TraceEmitter.prototype.constructor = TraceEmitter;

function TraceEvent(type, target, args, result){
  this.type = type;
  this.target = target;
  this.result = result;

  var i = 0;
  switch (type) {
    case 'keys':
    case 'names':
    case 'enumerate':
    case 'fix':
    case 'getProto':
      break;
    case 'setProto':
      this.value = args[0];
      break;
    case 'set':
      if (this.result === true)
        delete this.result;
    case 'define':
      this.value = args[1];
    case 'get':
    case 'describe':
      this.property = args[0];
      break;
    case 'apply':
      this.context = args[1];
    case 'construct':
      this.name = target.name;
      this.args = args[0];
  }
}

TraceEvent.prototype = Object.create(Emitter.Event.prototype);
TraceEvent.prototype.constructor = TraceEvent;

exports.tracer = function tracer(object, name){
  return new TraceEmitter(object, name);
}
exports.TraceEmitter = TraceEmitter;
exports.TraceEvent = TraceEvent;

}();

!function(){

var _Function = require('./utility').Function;
var _Object = require('./utility').Object;
var proxy = require('./proxy').proxy;


function callable(obj){
  return proxy(obj, handler, true);
}

function list(fwd){
  return fwd().filter(function(s){ return s !== '$$call' && s !== '$$construct' && !_Object.hasOwn(s) });
}

var handler = {
  enumerate: list,
  keys: list,
  names: list,
  apply: function(fwd, target, args, rcvr){
    var call = target.$$call;
    return call ? _Function.applying(call, target, args) : undefined;
  },
  construct: function(fwd, target, args){
    var construct = target.$$construct;
    var instance = proxy(Object.create(target), handler, true);
    if (construct) {
      var result = _Function.applying(construct, instance, args);
      return _Object.isObject(result) ? result : instance;
    } else {
      return instance;
    }
  }
};


exports.callable = callable;

}();

!function(){

var O = require('./utility').O;
var proxy = require('./proxy').proxy;
var WrapMap = require('./WrapMap').WrapMap;
var Descriptor = require('./utility').Descriptor;

var store = new WrapMap;
var wrap = store.wrap;
var unwrap = store.unwrap;



function listAccessors(o, p){
  var out = p || O.create(null);
  O.names(o).forEach(function(prop){
    var desc = O.describe(o, prop);
    if (desc.get || desc.set)
      out[prop] = desc;
  });
  return out;
}


var Interceptor = function(){
  function list(fwd, target){
    return fwd().concat(this.properties);
  }
  function owns(fwd, target, prop){
    return fwd() || prop in this.accessors;
  }

  function Interceptor(name, accessors, proto){
    var brand = '[object '+name+']';
    this.accessors = accessors;
    this.prototype = proto;
    this.stringifier = Descriptor.hiddenValue(
      O.has(proto, 'toString')
         ? proto.toString
         : function toString(){ return brand }
    );

    this.properties = O.keys(accessors);
  }

  Interceptor.keys = Object.freeze(Object.create(null));

  Interceptor.prototype = {
    getter: function getter(target, prop){
      return this.accessors[prop].get.call(unwrap(target));
    },
    setter: function setter(target, prop, value){
      return this.accessors[prop].set.call(unwrap(target), value);
    },
    names: list,
    keys: list,
    enumerate: list,
    has: owns,
    owns: owns,
    iterate: function iterate(fwd, target){
      fwd.trap = 'enumerate';
      var props = this.enumerate(fwd, target);
      var index = 0;
      return {
        next: function(){
          if (props.length === index)
            throw StopIteration;
          return props[index++];
        }
      }
    },
    getProto: function getProto(fwd, target){
      return this.fakeproto;
    },
    describe: function describe(fwd, target, prop){
      if (prop === 'toString' && !O.has(target, 'toString'))
        return this.stringifier;
      else if (prop in this.accessors) {
        var desc = O.describeOwn(this.prototype, prop);
        return {
          enumerable: desc.enumerable,
          configurable: true,
          writable: Boolean(desc.set),
          value: desc.get.call(unwrap(target))
        };
      } else
        return fwd();
    },
    define: function define(fwd, target, prop, desc){
      if (prop in this.accessors)
        return this.setter(target, prop, desc.value);
      else
        return fwd();
    },
    get: function get(fwd, target, prop, rcvr){
      if (prop === 'toString' && !O.has(target, 'toString'))
        return this.stringifier.value;
      else if (prop in this.accessors)
        return this.getter(target, prop);
      else
        return fwd();
    },
    set: function set(fwd, target, prop, value, rcvr){
      if (prop in this.accessors)
        return this.setter(target, prop, value);
      else
        return fwd();
      }
  };

  return Interceptor;
}();

var IndexedInterceptor = function(){
  var Ceptor = Interceptor.prototype;

  function numbers(start, end){
    if (!isFinite(end)) {
      end = start;
      start = 0;
    }
    var length = end - start;
    if (end > numbers.cache.length) {
      while (length--) numbers.cache[length+start] = String(length+start);
    }
    return numbers.cache.slice(start, end);
  }

  numbers.cache = [];

  function list(fwd, target){
    return numbers(this.prototype.length.call(unwrap(target))).concat(this.properties, fwd());
  }

  function has(fwd, target, prop){
    return isFinite(prop) ? prop < this.prototype.length.call(unwrap(target)) : prop in this.accessors || fwd();
  }

  function IndexedInterceptor(name, accessors, proto){
    Interceptor.apply(this, arguments);
    this.properties.push('length');
  }

  var indexed = IndexedInterceptor.keys = Object.create(null);
  indexed.get = true;
  indexed.set = true;
  indexed.length = true;
  Object.freeze(indexed);

  IndexedInterceptor.prototype = {
    __proto__: Ceptor,
    names: list,
    keys: list,
    enumerate: list,
    has: has,
    owns: has,
    describe: function(fwd, target, prop){
      if (isFinite(prop) && this.prototype.get)
        return Descriptor.value(this.prototype.get.call(unwrap(target), prop));
      else if (prop === 'length')
        return Descriptor.hiddenValue(this.prototype.length.call(unwrap(target)), true);
      else
        return Ceptor.describe.apply(this, arguments);
    },
    define: function(fwd, target, prop, desc){
      if (isFinite(prop) && this.prototype.set)
        return this.prototype.set.call(unwrap(target), prop, value);
      else
        return Ceptor.define.apply(this, arguments);
    },
    get: function(fwd, target, prop, rcvr){
      if (isFinite(prop) && this.prototype.get)
        return this.prototype.get.call(unwrap(target), prop);
      else if (prop === 'length')
        return this.prototype.length.call(unwrap(target));
      else
        return Ceptor.get.apply(this, arguments);
    },
    set: function(fwd, target, prop, value, rcvr){
      if (isFinite(prop) && this.prototype.set)
        return this.prototype.set.call(unwrap(target), prop, value);
      else
        return Ceptor.set.apply(this, arguments);
    },
  };

  return IndexedInterceptor;
}();

var NamedInterceptor = function(){
  var Ceptor = Interceptor.prototype;

  function list(fwd, target){
    return this.prototype.list.call(unwrap(target)).concat(this.properties, fwd());
  }

  function has(fwd, target, prop){
    return fwd() || this.prototype.has.call(unwrap(target), prop);
  }

  function NamedInterceptor(name, accessors, proto){
    Interceptor.apply(this, arguments);
  }

  var named = NamedInterceptor.keys = Object.create(null);
  named.get = true;
  named.set = true;
  named.has = true;
  named.list = true;
  Object.freeze(named);

  NamedInterceptor.prototype = {
    __proto__: Ceptor,
    names: list,
    keys: list,
    enumerate: list,
    has: has,
    owns: has,
    describe: function(fwd, target, prop){
      var inst = unwrap(target);
      if (this.prototype.has.call(inst, prop))
        return Descriptor.value(this.prototype.get.call(inst, prop));
      else if (prop in this.accessors)
        return Ceptor.describe.apply(this, arguments);
      else if (prop in this.fakeproto)
        return fwd();
      else
        return Descriptor.value(this.prototype.get.call(unwrap(target), prop));
    },
    define: function(fwd, target, prop, desc){
      var inst = unwrap(target);
      if (this.prototype.has.call(inst, prop))
        return this.prototype.set.call(inst, prop, desc.value);
      else if (prop in this.accessors)
        return this.setter(target, prop, desc.value);
      else
        return this.prototype.set.call(unwrap(target), prop, value);
    },
    get: function(fwd, target, prop, rcvr){
      var inst = unwrap(target);
      if (this.prototype.has.call(inst, prop))
        return this.prototype.get.call(inst, prop);
      else if (prop in this.accessors)
        return this.getter(target, prop);
      else
        return fwd();
    },
    set: function(fwd, target, prop, value, rcvr){
      var inst = unwrap(target);
      if (this.prototype.has.call(inst, prop))
        return this.prototype.set.call(inst, prop, value);
      else if (prop in this.accessors)
        return this.setter(target, prop, value);
      else
        return this.prototype.set.call(unwrap(target), prop, value);
    },
  };

  return NamedInterceptor;
}();


var Constructor = function(){
  var stringifier = Descriptor.hiddenValue(function toString(){
    return 'function '+this.name+'() { [native code] }';
  });

  function Constructor(name, ctor, template){
    this.template = template;
    this.ctor = ctor;
    return proxy(new Function('return function '+name+'(){}')(), this);
  }

  Constructor.prototype = {
    describe: function(fwd, target, prop){
      if (prop === 'prototype')
        return Descriptor.hiddenValue(this.template.fakeproto);
      else if (prop === 'toString')
        return stringifier;
      else
        return fwd();
    },
    get: function(fwd, target, prop, rcvr){
      if (prop === 'prototype')
        return this.template.fakeproto;
      else if (prop === 'toString')
        return stringifier.value;
      else
        return fwd();
    },
    apply: function(fwd, target, args, rcvr){
      var inst = Object.create(this.template.fakeproto);
      var out = proxy(inst, this.template);
      wrap(out, inst);
      this.ctor.apply(out, args);
      return out;
    },
    construct: function(fwd, target, args){
      var inst = Object.create(this.template.fakeproto);
      var out = proxy(inst, this.template);
      wrap(out, inst);
      this.ctor.apply(out, args);
      return out;
    }
  };

  return Constructor;
}();

var protos = new WeakMap;

exports.interceptor = function interceptor(name, Ctor, inherits){
  if (typeof name === 'function') {
    inherits = Ctor;
    Ctor = name;
    name = Ctor.name;
  }

  var proto = Ctor.prototype;
  var accessors = listAccessors(proto);
  if (inherits)
    listAccessors(protos.get(inherits), accessors);
  var Template = 'length' in proto ? IndexedInterceptor : 'list' in proto ? NamedInterceptor : Interceptor;
  var template = new Template(name, accessors, proto);
  var ctor = new Constructor(name, Ctor, template);

  template.fakeproto = O.namesOwn(proto).reduce(function(ret, key){
    if (!(key in accessors || key in Template.keys)) {
      var desc = O.describe(proto, key);
      if (key === 'constructor')
        desc.value = ctor;
      desc.enumerable = false;
      O.define(ret, key, desc);
    }
    return ret;
  }, O.create(O.getProto(proto)));

  protos.set(template.fakeproto, proto);
  return ctor;
}

}();

!function(){

var proxy = require('./proxy').proxy;

function doppelganger(callable){
  var handler = new Doppelganger;
  var doppel = proxy(handler.target, handler, callable);

  return function changeInfo(into){
    handler.target = Object(into);
    if (doppel)
      return [doppel, doppel = null][0];
  }
}

function Doppelganger(){
  this.target = {};
}

function targeter(fwd){
  fwd.target = this.target;
  return fwd();
}

Doppelganger.prototype = {
  getProto: targeter,
  setProto: targeter,
  names: targeter,
  describe: targeter,
  define: targeter,
  delete: targeter,
  fix: targeter,
  keys: targeter,
  enumerate: targeter,
  owns: targeter,
  has: targeter,
  get: targeter,
  set: targeter,
  apply: targeter,
  construct: targeter,
};

exports.doppelganger = doppelganger;

}();

!function(){

var _Object = require('./utility').Object;

var HashMap = function(){
  var hashmaps = new WeakMap;

  function HashMap(){
    hashmaps.set(this, Object.create(null));
  }

  _Object.extend(HashMap.prototype, [
    function has(key){
      return key in hashmaps.get(this);
    },
    function get(key){
      return hashmaps.get(this)[key];
    },
    function set(key, value){
      return hashmaps.get(this)[key] = value;
    },
    function delete_(key){
      var ret = this.has(key);
      if (ret)
        delete hashmaps.get(this)[key];
      return ret;
    }
  ]);

  return HashMap;
}();


function Store(values){
  if (_Object.isObject(values))
    this.set(values);
}

Store.prototype = Object.create(null, {
  set: { value: function set(key, value){
    if (_Object.isObject(key))
      Object.keys(key).forEach(function(k){
        this[k] = key[k];
      }, this);
    else
      this[key] = value;
  } },
  get: { value: function get(key){
    if (Array.isArray(key))
      return key.reduce(function(r,k){
        r[k] = this[k];
        return r;
      }.bind(this), {});
    else
      return this[key];
  } },
  toString: { value: function toString(){
    return '[object Store]';
  } },
  valueOf: { value: Object.prototype.valueOf }
});


exports.namespace = function namespace(){
  var ostore = new WeakMap
  var pstore = new HashMap;
  return function unwrap(target, values){
    var store = _Object.isObject(target) ? ostore : pstore;
    var data = store.get(target);
    if (!data) {
      data = new Store(values);
      store.set(target, data);
    }
    return data;
  }
}

}();
return exports;
}({}, this));