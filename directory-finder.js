// No longer using this file - was previously importing it into lesson file.

// [Compile Error] Cannot find module 'electron' from '/Users/isaacdurand/Documents/github/git-schooled'
// const ipcRenderer = require('electron').ipcRenderer;

var currentDirectory;

// Uncaught ReferenceError: ipcRenderer is not defined
ipcRenderer.on('curr-dir', function(event, arg) {
		currentDirectory = arg;
		console.log('currentDirectory:', currentDirectory);
});

export default currentDirectory;
