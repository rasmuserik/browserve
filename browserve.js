// # Under development not ready yet...
//
//

let fetch = require('node-fetch');
const {app, BrowserWindow} = require('electron');
const path  = require('path');
const url = require('url');

app.disableHardwareAcceleration()

let configUrl = process.env.BROWSERVE_CONFIG || 
  'https://rawgit.com/solsort/browserve/master/sample-config.json';
let config = fetch(configUrl).then(o => o.text());

let windows = [];
async function main(cfgText) {
  let cfg = JSON.parse(cfgText);
  console.log(cfg);
  for(let i = 0; i < cfg.apps.length; ++i) {
    let appCfg = cfg.apps[i];
    let w = windows[i] = new BrowserWindow(
      Object.assign({}, 
        cfg.windowConfig, 
        appCfg.windowConfig || {}
      ));
    w.loadURL(appCfg.url);
  }
  setInterval(checkChange, cfg.configReload);
  setTimeout(() => process.exit(0), cfg.restartTime);

// Restart if config has changed

  async function checkChange() {
    let config = await fetch(configUrl);
    config = await config.text();
    if(config !== cfgText) {
      process.exit(0);
    }
  }
}

app.on('ready', function() {
  config.then(main).catch(e => {
    console.log(e);
    setTimeout(() => process.exit(-1), 30000);
    throw e;
  });
});

var wsClients = new Map();

startServer = () => {
  var app = require('express')();
  app.use(require('express').static(__dirname));

  var server = require('http').createServer(app);

  var wss = new (require('ws').Server)({
    perMessageDeflate: false,
    server: server
  });

  wss.on('connection', (ws) => {
    let nid;
    ws.once('message', (msg) => {
      nid = require('crypto')
        .createHash('sha256')
        .update(msg, 'latin1')
        .digest('base64').slice(0, 32);

      wsClients.set(nid, ws);
      ws.send(nid);
      ws.on('message', (msg) => {
        let clients = wsClients.get(msg.slice(0, 32));
        if(client) {
          client.send(msg.slice(32));
        }
      });
    });
    ws.on('close', () => {
      if(nid) {
        wsClients.delete(nid);
      }
    });
  });

  server.listen(8888, () => console.log('started server on port 8888'));
};

startServer();
