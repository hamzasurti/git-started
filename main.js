'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const	BrowserWindow = electron.BrowserWindow;
const pty = require('pty.js');

var mainWindow = null;
// What does it mean for a JS object to be garbage collected?

// console.log('electron is', electron); // Electron seems to be defined correctly in both my terminal and the Electron console.
// console.log('app is', app); // Weird - app is defined correctly in my terminal, but it's undefined in the Electron console.

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL('file://' + __dirname + '/index.html');


	var term = pty.spawn('bash', [], {
	  name: 'xterm-color',
	  cols: 80,
	  rows: 50,
	  cwd: process.env.HOME,
	  env: process.env
	});




	var currentDirectory = ""
console.log(process.env._);
	ipcMain.on('command-message', function(event, arg) {

		term.write(arg);
		// term.resize(100, 40);
		term.write(' && ls\r');
		term.write('&& basename ' +  process.env._);
		term.on('data', function(data) {
			event.sender.send('terminal-reply', data);
		});
		// term.end()
	});

	// For testing only
	mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
