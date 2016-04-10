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
      if(index === '' || (index[0] === '.' && index.substring(0,4) !== '.git')) return;
      var elementObj = {
        "name": index,
        "level": "#ccc"
      }
      if (index.substring(0,4) === ".git"){
        if(index.substring(index.length - 1) === '/') elementObj.icon = "assets/folder.png"
        else elementObj.icon = "assets/git.png";
        elementObj.level = "#ccc";
        schema.children.push(elementObj);
        return;
      }

      var temp = terminalParse(index, elementObj);
      if (modified) modifiedAnimation(modified, elementObj, index, temp);
      schema.children.push(elementObj);
    });
  schema = [schema];
  return schema;
};

function modifiedAnimation(info, object, item, string){
  for (var i = 0, len = info.length; i < len; i++){
    if(info[i].indexOf(item) > -1){
      object.level = "#ccc";
      object.icon  = "assets/64pxRed/" + string + ".png";
      return;
    }
  }
  return;
}

function terminalParse(item, object){
  if(item[item.length - 1] === '/'){
    var itemParse = 'folder';
    object.type = 'directory';
    object.icon = "assets/64pxBlue/folder.png";
    return itemParse;
  }
  else{
    var itemParse = item.replace(/^\w+./,'');
    if(!(itemParse in container)) itemParse = 'file';
    object.icon = "assets/64pxBlue/" + itemParse + ".png";
    return itemParse;
  }
}

module.exports = {
  dataSchema(pwd, asyncWaterfallCallback) {
    // child process that gets all items in a directory
    // const command = `cd ${pwd}; ls -ap;`;
    // if (!pwd) return;
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
