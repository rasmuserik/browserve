(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, __dirname) {let main = (() => {
  var _ref = _asyncToGenerator(function* (cfgText) {

    // Restart if config has changed

    let checkChange = (() => {
      var _ref2 = _asyncToGenerator(function* () {
        let config = yield fetch(configUrl);
        config = yield config.text();
        if (config !== cfgText) {
          process.exit(0);
        }
      });

      return function checkChange() {
        return _ref2.apply(this, arguments);
      };
    })();

    let cfg = JSON.parse(cfgText);
    console.log(cfg);
    for (let i = 0; i < cfg.apps.length; ++i) {
      let appCfg = cfg.apps[i];
      let w = windows[i] = new BrowserWindow(Object.assign({}, cfg.windowConfig, appCfg.windowConfig || {}));
      w.loadURL(appCfg.url);
    }
    setInterval(checkChange, cfg.configReload);
    setTimeout(function () {
      return process.exit(0);
    }, cfg.restartTime);
  });

  return function main(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// # Browserve 
//
// Server-side browser daemons, and pubsub.  This application does two things:
//
// 1. Runs a set of web-apps as daemons on the server, based on a JSON config file on a given url.
// 2. Hosts a simple websocket anycast pubsub service, that allows communication between web apps.
//
// When this is combined with a CouchDB, you have a fully generic backend, which support many application needs.
//
// ## Server-side browser daemons

let fetch = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"node-fetch\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let { app, BrowserWindow } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"electron\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

app.disableHardwareAcceleration();

let configUrl = process.env.BROWSERVE_CONFIG || 'https://rawgit.com/solsort/browserve/master/sample-config.json';
let config = fetch(configUrl).then(o => o.text());

let windows = [];


app.on('ready', function () {
  config.then(main).catch(e => {
    console.log(e);
    setTimeout(() => process.exit(-1), 30000);
    throw e;
  });
});

// ## Websocket anycast pubsub

let wsClients = new Map();

startServer = () => {
  let app = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"express\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))();
  app.use(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"express\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).static(__dirname));

  let server = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"http\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).createServer(app);

  let wss = new (__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ws\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).Server)({
    perMessageDeflate: false,
    server: server
  });

  wss.on('connection', ws => {
    let nid;
    ws.once('message', msg => {
      nid = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"crypto\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).createHash('sha256').update(msg, 'latin1').digest('base64').slice(0, 32);

      let clients = wsClients.get(nid) || [];
      clients.push(ws);
      wsClients.set(nid, clients);
      ws.send(nid);
      ws.on('message', msg => {
        let clients = wsClients.get(msg.slice(0, 32));
        if (clients) {
          clients[clients.length * Math.random() | 0].send(msg.slice(32));
        }
      });
    });
    ws.on('close', () => {
      if (nid) {
        let clients = wsClients.get(nid);
        clients = clients.filter(o => o !== ws);
        if (clients.length > 0) {
          wsClients.set(nid, clients);
        } else {
          wsClients.delete(nid);
        }
      }
    });
  });

  server.listen(8888, () => console.log('started server on port 8888'));
};

startServer();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), "/"))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=dist.js.map