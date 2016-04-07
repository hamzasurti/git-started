'use strict';
const exec = require('child_process').exec;
const simpleGit = require('simple-git');
const path = require('path');

var container = {
  'css':  null,
  "html": null,
  'js':   null,
  'rb':   null,
  'py':   null,
  'json': null,
  'pdf':  null,
  'png':  null
}

var schemaMaker = function(termOutput, directoryName, modified){
    var schema = {
      "name": directoryName,
      "children": [],
      "position_x": '-10px',
      "position_y": '-20px',
      "value": 40,
      'icon' : "assets/64pxBlue/folder.png",
      "level": "#ccc"
    };
    // loops through reply and puts it in D3 readable structure
    termOutput.forEach((index) => {
      // checks if file has any alphanumeric characters
      var temp = index.replace(/^\w+./,'');

      if(!(temp in container)) temp = 'file';
      var elementObj = {
        "name": index,
        "icon": "assets/64pxBlue/" + temp + ".png",
        "level": "#ccc"
      }
      if(index.substring(index.length -1 ) === '/'){
        elementObj.icon = "assets/64pxBlue/folder.png";
        index = index.substring(0,index.length - 1);
      }
      //add modified red folder path logic here
      if (index.substring(0,4) === ".git" || !!index.match(/^\w/)) {
        // makes .git foldrs black
        if (index.substring(0,4) === ".git") {
          elementObj.level = "black";
        }
        if (modified){
          var modifiedObject = {};
          for (var i = 0, len = modified.length; i < len; i++){
            var hash = modified[i].split('/');
            for(var j = 0; j < hash.length; j++){
              if(!(hash[j] in modifiedObject)){
                modifiedObject[hash[j]] = null;
              }
            }
          }

          if(index in modifiedObject){
            elementObj.level = 'red';
            elementObj.icon = "assets/64pxRed/" + temp + ".png";
          }

          // for (var i = 0, len = modified.length; i < len; i++){
          //   if (modified[i] === index) {
          //     elementObj.level = "red";
          //     elementObj.icon = "assets/64pxRed/" + temp + ".png";
          //   }
          // }




        }
        schema.children.push(elementObj);
      }
    });
  schema = [schema];
  return schema;
};

module.exports = {
  dataSchema(pwd, asyncWaterfallCallback) {
    // child process that gets all items in a directory
    // const command = `cd ${pwd}; ls -ap;`;
    const command = 'cd ' + pwd + '; ls -ap';

    exec(command, (err, stdout) => {
      if (err) {
        console.log('the error you are getting with ls is: ==>', err.toString());
      } else {
        const stdoutArr = stdout.split('\n');
        const currentDirectoryName = path.parse(pwd).name;
        let modifiedFiles;
        // git command to check git status
        simpleGit(pwd).status((error, i) => {
          modifiedFiles = i.modified;
          const schema = schemaMaker(stdoutArr, currentDirectoryName, modifiedFiles);
          process.send ? process.send({ schema: schema }) : asyncWaterfallCallback(null, schema);
          return schema;
        });
      }
    });
  },
};
