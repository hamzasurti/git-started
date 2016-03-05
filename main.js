'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const BrowserWindow = electron.BrowserWindow;
const pty = require('pty.js');

