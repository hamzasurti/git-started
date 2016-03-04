console.log('app.js is running');

// document.write('node^');
// document.write(process.versions.node);
// document.write('process.versions.chrome');
// document.write(process.versions.chrome);
// document.write('process.versions.electron');
// document.write(process.versions.electron);

const fs = require('fs');
const $ = require('jquery');

const ipcRenderer = require('electron').ipcRenderer;
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
// ipcRenderer.on('current', (event, arg) => {
//   $('.current').append(arg);
// });

ipcRenderer.on('terminal-reply', (event, arg) => {
 $('#terminal').append(arg);
 console.log(arg); // prints "pong"
});

$('form').submit((e) =>{
 e.preventDefault();
 var command = $('input').val();
 ipcRenderer.send('command-message', command);
})

// console.log('temp.process ====>  ',term.process);