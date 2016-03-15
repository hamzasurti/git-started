const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js
const ipcRenderer = require('electron').ipcRenderer; // allows render process and main process to communicate: http://electron.atom.io/docs/v0.36.8/api/ipc-renderer
