const fs = require('fs');
const $ = require('jquery');
const Terminal = require('term.js'); // terminal written in JS: https://github.com/chjj/term.js
const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js

const ipcRenderer = require('electron').ipcRenderer; // allows render process and main process to communicate: http://electron.atom.io/docs/v0.36.8/api/ipc-renderer
const elem = document.getElementById("Terminal");


const term = new Terminal({ // creates a new term.js terminal
  cursorBlink: true,
  useStyle: true,
  cols: 100,
  rows: 20
});


term.open(elem);
var ptyProcess = pty.fork('bash', [], {
  cwd: process.env.HOME,
  env: process.env,
  name: 'xterm-256color'
});

term.on("data", function(data) {
  ipcRenderer.send('command-message', data);
});

ptyProcess.on('data', (data) => {
  term.write(process.env.HOME + ' $ ');
})

ipcRenderer.on('terminal-reply', (event, arg) => {
  console.log(arg);
 term.write(arg);
});
