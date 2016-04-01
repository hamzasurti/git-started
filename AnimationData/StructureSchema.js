const exec = require('child_process').exec;
const simpleGit = require('simple-git');
const path = require('path')

module.exports = {
  schemaMaker: function(termOutput, directoryName, modified){
    var schema = {
      "name": directoryName,
      "children": [],
      "position_x": '-10px',
      "position_y": '-20px',
      "value": 40,
      'icon' : "assets/folder.png",
      "level": "#ccc"
    };
    // loops through reply and puts it in D3 readable structure
    termOutput.forEach((index) => {
      // checks if file has any alphanumeric characters
      var temp = index.replace(/^\w+./,'');
      var elementObj = {
        "name": index,
        "icon": "assets/64pxBlue/" + temp + ".png",
        "level": "#ccc"
      }

      if(index.substring(index.length -1 ) === '/'){
        elementObj.icon = "assets/folder.png";
      }

      if (index.substring(0,4) === ".git" || !!index.match(/^\w/)) {
        // makes .git foldrs black
        if (index.substring(0,4) === ".git") elementObj.level = "black";
        if (modified){
          for (var i = 0, len = modified.length; i < len; i++){
            if (modified[i] === index) {
              elementObj.level = "red"
              elementObj.icon = "assets/64pxRed/" + temp + ".png"
            }
          }
        }
        schema.children.push(elementObj)
      }
    })
    schema = [schema]
    return schema;
  },

  // Can we decide here whether to send the response back to the client?
  // Basically, we want the ability to run commands independent of the client.
  DataSchema: function(pwd,asyncWaterfallCallback) {
    // child process that gets all items in a directory
    const that = this

  	var command = 'cd ' + pwd + ';ls -ap';
  	exec(command, (err, stdout, stderr) => {
  			if (err) {
  				console.log(err.toString());
  			} else {
  				var stdoutArr = stdout.split('\n');
          var currentDirectoryName = path.parse(pwd).name;
  				var modifiedFiles;

          // git command to check git status
  				simpleGit(pwd).status((err, i) => {
  					modifiedFiles = i.modified;
  					// var schema = this.schemaMaker(stdoutArr,current, modifiedFiles);
            // process.send ? process.send({schema: schema}) : asyncWaterfallCallbackcallback(null, schema);

  					var schema = that.schemaMaker(stdoutArr, currentDirectoryName, modifiedFiles);
            process.send ? process.send({schema: schema}) : asyncWaterfallCallback(null, schema);
            return schema;
  				})
  			}
  	})
  }
};
