'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const	BrowserWindow = electron.BrowserWindow;
const pty = require('pty.js');
const net = require('net');

var mainWindow = null;
// What does it mean for a JS object to be garbage collected?

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL('file://' + __dirname + '/index.html');


	// var ptyTerm = pty.fork('bash', [], {
	//   name: 'xterm-color',
	//   cols: 80,
	//   rows: 50,
	//   cwd: process.env.HOME,
	//   env: process.env
	// });
	//
	//
	// ipcMain.on('command-message', function(event, arg) {
	// 	ptyTerm.write(arg);
	//
	// 	ptyTerm.on('data', function(data) {
	// 		event.sender.send('terminal-reply', data);
	// 	});
	// });

	// For testing only
	mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
