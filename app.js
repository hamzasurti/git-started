const fs = require('fs');
const $ = require('jquery');
const Terminal = require('term.js'); // terminal written in JS: https://github.com/chjj/term.js
const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js


const ipcRenderer = require('electron').ipcRenderer; // allows render process and main process to communicate: http://electron.atom.io/docs/v0.36.8/api/ipc-renderer
var elem = document.getElementById("Terminal");
console.log(elem);

const term = new Terminal({ // creates a new term.js terminal
  cursorBlink: true,
  cols: 100,
  rows: 20
});

term.open(elem); // appends that terminal to elem
var ptyProcess = pty.fork('bash', [], {
cwd: process.env.HOME,
env: process.env,
name: 'xterm-256color'
});
console.log(ptyProcess.process);

ptyProcess.on('data', (data) =>{
  console.log('hi everyone ptyprocess does stuff');
})

ipcRenderer.on('terminal-reply', (event, arg) => {
 // $('#Terminal').append(arg);
 term.write(arg);
 console.log(arg);
});

$('form').submit((e) => {
 e.preventDefault();
 var command = $('input').val();
 ipcRenderer.send('command-message', command);
})

// console.log('temp.process ====>  ',term.process);
