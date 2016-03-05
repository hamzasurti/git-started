// document.write('node^');
// document.write(process.versions.node);
// document.write('process.versions.chrome');
// document.write(process.versions.chrome);
// document.write('process.versions.electron');
// document.write(process.versions.electron);

const fs = require('fs');
const $ = require('jquery');

const ipcRenderer = require('electron').ipcRenderer;
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
// ipcRenderer.on('current', (event, arg) => {
//   $('.current').append(arg);
// });

ipcRenderer.on('terminal-reply', (event, arg) => {
 $('#terminal').append(arg);
 console.log(arg); // prints "pong"
});

$('form').submit((e) =>{
 e.preventDefault();
 var command = $('input').val();
 ipcRenderer.send('command-message', command);
})

// console.log('temp.process ====>  ',term.process);

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

console.log(getFiles('path/to/dir'))