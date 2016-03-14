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

	var ptyTerm = pty.spawn('bash', [], {
		name: 'xterm-color',
		cols: 80,
		rows: 50,
		cwd: process.env.HOME,
		env: process.env
	});
	ipcMain.on('command-message', function(event, arg) {
		console.log(ptyTerm);
		ptyTerm.write(arg);
		// ptyTerm.write('challengesPS1=$(basename "`pwd`"" ""$")');
		ptyTerm.removeAllListeners('data');
		ptyTerm.on('data', function(data) {
			event.sender.send('terminal-reply', data);

		});
	});


// For running tests to see whether the user is ready to advance
	// Listen for commands from the lesson file.
	ipcMain.on('command-to-run', function(event, arg) {
		// Upon receiving a command, run it in the terminal.
			// For testing only
			// exec('pwd', function(err, stdout, stderr) {
			// 	console.log('*****\n\nworking directory:', stdout);
			// });
			// exec('ls', function(err, stdout, stderr) {
			// 	console.log('contents:', stdout);
			// });
		// For reals

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
		// console.log('main.js has recieved the test result:', arg);
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
