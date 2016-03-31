// We may be running into errors trying to browserify these two lines.
const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js
const ipcRenderer = require('electron').ipcRenderer; // allows render process and main process to communicate: http://electron.atom.io/docs/v0.36.8/api/ipc-renderer


// var fs = require('fs');

// if (process.argv.length <= 2) {
//     console.log("Usage: " + __filename + " path/to/directory");
//     process.exit(-1);
// }
//
// var path = process.argv[2];
//
// fs.readdir(path, function(err, items) {
//     console.log(items);
//
//     for (var i=0; i<items.length; i++) {
//         console.log(items[i]);
//     }
// });

// var walk    = require('walk');
// var repo;
// repo = './components'
//
// var walker  = walk.walk(repo, { followLinks: true });
//
// // Walker on Files
// var file_data   = [];
// walker.on('file', function(root, stat, next) {
//     var temp = {};
//     temp['parent_directory'] = root.replace(/(.*[\\\/])/,'');
//     temp['name'] = stat.name;
//     temp['type'] = stat.type;
//     file_data.push(temp);
//     next();
// });
//
// // Walker on Directory
// var dir_data = [];
// walker.on('directory', function(root, stat, next){
//   var temp = {};
//   temp['parent_directory'] = root.replace(/(.*[\\\/])/,'');
//   temp['name'] = stat.name;
//   temp['type'] = stat.type;
//   temp['children'] = [];
//   dir_data.push(temp)
//   next();
// })
//
// walker.on('end', function() {
//   var result = [
//     {
//       'name': repo.replace(/(.*[\\\/])/,''),
//       'children': []
//     }
//   ];
//
//   (function file_to_directory(){
//     for(var i = 0; i < dir_data.length; i++){
//       for(var j = 0; j < file_data.length; j++){
//         if(dir_data[i].name === file_data[j].parent_directory){
//           dir_data[i].children.push(file_data[j])
//           file_data.splice(j,1);
//           j = j-1;
//         }
//       }
//     }
//   })();
//
//   // (function directory_nesting(){
//   //
//   //
//   // })();
//
//   (function sibling_to_sibling(){
//     for(var j = 0; j < file_data.length; j++){
//       result[0].children.push(file_data[j]);
//     }
//     file_data = null;
//
//     for(var i = 0; i < dir_data.length; i ++){
//       result[0].children.push(dir_data[i]);
//     }
//     // dir_data = null;
//   })();
//
//   console.log('dir_data', dir_data);
//   console.log(result);
// });
