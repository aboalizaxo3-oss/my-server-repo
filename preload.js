const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  appName: 'Kawar Auction Desktop',
  version: process.versions.electron
});
