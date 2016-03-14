'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const BrowserWindow = electron.BrowserWindow;
const pty = require('pty.js');
const net = require('net');

// Require the child_process module so we can communicate with the user's terminal
const exec = require('child_process').exec;

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


	//
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


// For running tests to see whether the user is ready to advance
	ipcMain.on('test-message', function(event, arg) {

		exec(arg, function(err, stdout, stderr) {
			// if (err) throw err; // This displays a pop-up error message in Electron, which is probably not what I want. But I also probably need to handle errors somehow.
			// console.log(stdout); // for testing only - shows up in my terminal
			event.sender.send('test-reply', stdout);
		});
	});

	ipcMain.on('test-passed', function(event, arg) {

		console.log('Result received:', arg);
		// If the user passed (if arg is true)...
		if (arg) {
			// advance
		} else {
			// setState
		}
		// How can I trigger these functions, which are located on Dashboard?

	});

	// For testing only
	mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
