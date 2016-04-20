/* eslint-disable strict */

// Use strict mode so that we can use let and const.
'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const BrowserWindow = electron.BrowserWindow;
const animationDataSchema = require('./AnimationData/StructureSchema');
const async = require('async');

// Require the child_process module so we can communicate with the user's terminal
const exec = require('child_process').exec;
const fork = require('child_process').fork;

let mainWindow = null;

function ptyChildProcess() {
  const ptyInternal = require.resolve('./ptyInternal');
  const forkProcess = fork(ptyInternal);

  // Prevent the app from showing dummy data on initial load.
  ipcMain.on('ready-for-schema', (event, arg) => forkProcess.send({ message: arg }));

  // Ensure that we have Git data to show the first time the users toggles to the Git view.
  ipcMain.on('ready-for-git', (event, arg) => forkProcess.send({ message: arg }));

  // For the lesson, ensure that we know the user's current directory before testing whether they
  // created a 'new-project' directory.
  ipcMain.on('ready-for-dir', (event, arg) => forkProcess.send({ message: arg }));

  // When user inputs data in terminal, start fork and run pty inside.
  // Each keystroke is an arg.
  ipcMain.on('command-message', (event, arg) => {
    forkProcess.send({ message: arg });
    forkProcess.removeAllListeners('message');
    forkProcess.on('message', (message) => {
      // Send what is diplayed in terminal
      if (message.data) event.sender.send('terminal-reply', message.data);
      // Send animation schema
      if (message.schema) event.sender.send('direc-schema', message.schema);
      // Send Git data
      if (message.gitGraph) event.sender.send('git-graph', message.gitGraph);
      // Send current directory
      if (message.currDir) event.sender.send('curr-dir', message.currDir);
    });
  });
}

// Run the appropriate test to see whether the user is ready to advance in the lesson.
function slideTests() {
  // Listen for commands from the lesson file.
  ipcMain.on('command-to-run', (event, arg) => {
    // Upon receiving a command, run it in the terminal.
    exec(arg, (err, stdout) => {
      // Send the terminal's response back to the lesson.
      if (err) return event.sender.send('terminal-output', err.toString());
      return event.sender.send('terminal-output', stdout);
    });
  });

  // Listen for a Boolean from the lesson file.
  ipcMain.on('test-result-1', (event, arg) => {
    // Upon receiving it, send it to the Dashboard.
    event.sender.send('test-result-2', arg);
  });
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  const dummy = new BrowserWindow({ show: false });
  // Force replace icon to load
  dummy.setProgressBar(-1);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 900,
    minHeight: 500,
    titleBarStyle: 'hidden-inset',
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Initialize fork
  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(async.waterfall([
      async.apply(animationDataSchema.dataSchema, process.env.HOME),
      (data) => {
        mainWindow.webContents.send('direc-schema', data);
      },
    ]), 0);

    mainWindow.webContents.send('term-start-data', `${process.env.HOME} $ `);

    ptyChildProcess();
    slideTests();
  });

  // Set mainWindow back to null when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
