let main = (() => {
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

let fetch = require('node-fetch');
let { app, BrowserWindow } = require('electron');

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
  let app = require('express')();
  app.use(require('express').static(__dirname));

  let server = require('http').createServer(app);

  let wss = new (require('ws').Server)({
    perMessageDeflate: false,
    server: server
  });

  wss.on('connection', ws => {
    let nid;
    ws.once('message', msg => {
      nid = require('crypto').createHash('sha256').update(msg, 'latin1').digest('base64').slice(0, 32);

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
