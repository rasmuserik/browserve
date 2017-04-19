// # Under development not ready yet...
//
let fetch = require('node-fetch');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

app.disableHardwareAcceleration();

let w;

let configUrl = process.env.BROWSERVE_CONFIG || 'https://rawgit.com/solsort/browserve/master/sample-config.json';
let config = fetch(configUrl).then(o => o.text());

let browserWindowConfig = {
  nodeIntegration: false,
  show: false,
  webPreferences: { webSecurity: false },
  webgl: false,
  webaudio: false,
  images: false
};

app.on('ready', function () {
  config.then(cfgText => {
    console.log('config', cfgText);
    setTimeout(() => process.exit(0), 5000);
  }).catch(e => {
    console.log(e);
    setTimeout(() => process.exit(-1), 5000);
    throw e;
  });
  w = new BrowserWindow();

  w.loadURL('http://forsider.solsort.com');
  w.on('closed', () => w = null);
});
app.on('window-all-closed', () => app.quit());
