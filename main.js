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

	// initialize fork
	var forkProcess = fork('ptyInternal');

	ptyChildProcess(forkProcess);
	slideTests();

	// For testing only, opens dev tools
	mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});




function initialLoadEvents(){
	// I'm not seeing any of the console logs in this function.

	// when window finished loading, send current directory and animation structure
	mainWindow.webContents.on('did-finish-load', () => {
		console.log('running initialLoadEvents');
		mainWindow.webContents.send('term-start-data', process.env.HOME + ' $ ');
		async.waterfall([
			async.apply(animationDataSchema.DataSchema, process.env.HOME),
			(data) => {
				console.log('sending direc-schema from main.js');
				mainWindow.webContents.send('direc-schema', data);
			}
		]);
	});
}

function ptyChildProcess(forkProcess){

	// when user inputs data in terminal, start fork and run pty inside
	ipcMain.on('command-message', (event, arg) => {
		forkProcess.send({message: arg});
		forkProcess.removeAllListeners('message')
		forkProcess.on('message', (message) =>{
			// sends what is diplayed in terminal
			if (message.data) event.sender.send('terminal-reply', message.data);

			// sends animation schema
			if (message.schema) event.sender.send('direc-schema', message.schema);
		})
	});
}

function slideTests(){// For running tests to see whether the user is ready to advance
	// Listen for commands from the lesson file.
	ipcMain.on('command-to-run', function(event, arg) {
		// Upon receiving a command, run it in the terminal.

		exec(arg, function(err, stdout, stderr) {
			// Send the terminal's response back to the lesson.
			if (err) {
				console.log(err.toString()); // This will give me the human-readable text description of the error from the Error object.
			} else {
				console.log('terminal output:', stdout);
			}
			if (err) return event.sender.send('terminal-output', err.toString());
			event.sender.send('terminal-output', stdout);
		});
	});
	// Listen for a Boolean from the lesson file.
	ipcMain.on('test-result-1', function(event, arg) {
		// Upon receiving it, send it to the Dashboard.
		event.sender.send('test-result-2', arg);
	});
}
