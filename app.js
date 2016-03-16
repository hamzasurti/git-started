const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js
const ipcRenderer = require('electron').ipcRenderer; // allows render process and main process to communicate: http://electron.atom.io/docs/v0.36.8/api/ipc-renderer


var walk    = require('walk');
var data   = [

];
var repo;

repo = './components'
// Walker options
var walker  = walk.walk(repo, { followLinks: true });

walker.on('names', function(root, stat, next) {
    // Add this file to the list of files
    // console.log(root, stat)
    var temp = {};
    temp['name'] = root
    temp['children'] = stat
    data.push(temp);

    next();
});

// walker.on('directories', function(root, stat, next) {
//     // Add this file to the list of files
//     console.log(root, stat)
//     var temp = {};
//     temp['name'] = root
//     temp['children'] = stat
//     data.push(temp);
//
//     next();
// });



walker.on('end', function() {
    console.log(data);
});
