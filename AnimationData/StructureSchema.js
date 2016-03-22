

const exec = require('child_process').exec;
const simpleGit = require('simple-git');


function schemaMaker(termOutput, directoryName, modified){
  var schema = {
    "name": directoryName,
    "children": [],
    "value": 15,
    "level": '#33C3F0'
  };
// loops through reply and puts it in D3 readable structure
  termOutput.forEach((index) => {
    // checks if file has any alphanumeric characters
    if (index.substring(0,4) === ".git" || !!index.match(/^\w/)) {
      var elementObj = {"name":index}
      // makes .git foldrs black
      if (index.substring(0,4) === ".git") elementObj.level = "black";
      if (modified){
        for (var i = 0; i < modified.length; i++){
          if (modified[i] === index){
            elementObj.level = "red"
          }
        }
      }
      schema.children.push(elementObj)
    }
  })
  schema = [schema]
  return schema;
}
module.exports = {

  DataSchema: (pwd,callback) => {
    // child process that gets all items in a directory
  	var command = 'cd ' + pwd + ';ls -a';
  	exec(command, (err, stdout, stderr) => {
  			if (err) {
  				console.log(err.toString());
  			} else {
  				var stdoutArr = stdout.split('\n');
  				var current = pwd.replace(/(.*[\\\/])/,'')
  				var modifiedFiles;
          // git command to check git status
  				simpleGit(pwd).status((err, i) => {
  					modifiedFiles = i.modified;
  					var schema = schemaMaker(stdoutArr,current, modifiedFiles);
            if (process.send) process.send({schema: schema})
            else {
              callback(null, schema)
            };
  				})
  			}
  	})
  }
};
