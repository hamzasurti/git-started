'use strict';
const electron = require('electron');
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const	BrowserWindow = electron.BrowserWindow;
const animationDataSchema = require('./AnimationData/StructureSchema')
const async = require('async');

// Require the child_process module so we can communicate with the user's terminal
const exec = require('child_process').exec;
const fork = require('child_process').fork;

var mainWindow = null;

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', () => {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL('file://' + __dirname + '/index.html');


// when window finished loading, send current directory and animation structure
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents.send('term-start-data', process.env.HOME + ' $ ');
		async.waterfall([
			async.apply(animationDataSchema.DataSchema, process.env.HOME),
			(data) => {mainWindow.webContents.send('direc-schema', data)}
		]);
	});

// initialize fork
	var forkProcess = fork('ptyInternal');

// when user inputs data in terminal, start fork and run pty inside
	ipcMain.on('command-message', (event, arg) => {
		forkProcess.send({message: arg});
		forkProcess.removeAllListeners('message')
		forkProcess.on('message', (message) =>{
			// sends what is diplayed in terminal
			if (message.data){
				event.sender.send('terminal-reply', message.data);
			}
			// sends animation schema
			if (message.schema) {
				event.sender.send('direc-schema', message.schema);
			}
		})
	});






// For running tests to see whether the user is ready to advance
	// Listen for commands from the lesson file.
	ipcMain.on('command-to-run', function(event, arg) {
		// Upon receiving a command, run it in the terminal.

		exec(arg, function(err, stdout, stderr) {
			// Send the terminal's response back to the lesson.
				// For testing only
				console.log('command executed:', arg);
				if (err) {
					console.log(err.toString()); // This will give me the human-readable text description of the error from the Error object.
				} else {
					console.log('terminal output:', stdout);
				}
			if (err) return event.sender.send('terminal-output', err.toString()); // Should I send something else? Would stdout ever begin with the word 'Error'?
				// For testing only
				// exec('pwd', function(err, stdout, stderr) {
				// 	console.log('working directory at end:', stdout);
				// });
			event.sender.send('terminal-output', stdout);
		});
	});

	// Listen for a Boolean from the lesson file.
	// Is there a way to cut out the middleman here and send the test result directly from the lesson to Dashboard.js (rather than from the lesson to main.js and then from main.js to Dashboard.js)? I tried adding 'ipcRenderer.on('test-result-1'...)' to Dashboard.js, but that didn't work.
	ipcMain.on('test-result-1', function(event, arg) {
		// Upon receiving it, send it to the Dashboard.
		event.sender.send('test-result-2', arg);
	});

	// For testing only
	mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
