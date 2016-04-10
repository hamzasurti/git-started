'use strict'
const pty = require('pty.js');
const animationDataSchema = require('./AnimationData/StructureSchema');
const getGitData = require('./AnimationData/gitData');

let currDir;
const ptyTerm = pty.fork('bash', [], {
  name: 'xterm-color',
  cols: 175,
  rows: 17,
  cwd: process.env.HOME,
  env: process.env,
});


  // sets the terminal prompt to pwd
	// We can read the bash profile here with the source command.
ptyTerm.write(`PROMPT_COMMAND='PS1=$(pwd)" $ "'\r`)
ptyTerm.write(`clear \r`); // originally had \n before \r

process.once('message', function(data) {
	animationDataSchema.dataSchema(process.env.HOME)
});
process.on('message', function(data) {
	if (data.message.cols) {
    ptyTerm.resize(data.message.cols,data.message.rows);
  } else {
    ptyTerm.write(data.message)
  }
});


ptyTerm.on('data', function(data) {
  // crude way to find path, need to improve
  process.send({
    data:data
  })
  var re = /\s[$]\s/g;
  if (data.match(re)) {
    var temp = data;
    temp = temp.replace(re,'');
    currDir = temp;
    process.send({ currDir: currDir });
    animationDataSchema.dataSchema(currDir);
		getGitData.gitHistory(currDir);
  }
});
