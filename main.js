'use strict';

const electron = require('electron');
const app = electron.app;
const	BrowserWindow = electron.BrowserWindow;

var mainWindow = null;
// What does it mean for a JS object to be garbage collected?

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 900, height: 600});
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// For testing only	
	// mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});