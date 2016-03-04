'use strict';

const electron = require('electron');
const app = electron.app;
// const ipcMain = require('electron').ipcMain;
const	BrowserWindow = electron.BrowserWindow;
// const pty = require('pty.js');

var mainWindow = null;
// What does it mean for a JS object to be garbage collected?

console.log(electron); // Why is electron undefined? It's defined for Doc-tor.
// When I add electron to the package.json, it becomes defined, but it's defined as something different from what I see with Doc-tor.
// I'll try cleaning out my node_modules and then see what happens.
console.log(app); // This is loggin undefined. Is there an async issue?
// Using electron.app here didn't fix things
app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL('file://' + __dirname + '/index.html');


	// var term = pty.spawn('bash', [], {
	//   name: 'xterm-color',
	//   cols: 80,
	//   rows: 30,
	//   cwd: process.env.HOME,
	//   env: process.env
	// });


	// var currentDirectory = ""

	// ipcMain.on('command-message', function(event, arg) {
	// 	// currentDirectory = currentDirectory + arg;
	// 	// event.sender.send('current', currentDirectory);
	// 	term.write(arg);
	// 	// term.resize(100, 40);
	// 	term.write(' && ls\r');
	// 	// term.write('&& history -c')
	// 	term.on('data', function(data) {
	// 		event.sender.send('terminal-reply', data);
	// 	});
	// 	// term.end()
	// });



	// For testing only
	mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
