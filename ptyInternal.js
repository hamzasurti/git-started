'use strict'
const pty = require('pty.js');
const animationDataSchema = require('./AnimationData/StructureSchema');
const getGitData = require('./AnimationData/gitData');

let currDir;
const ptyTerm = pty.fork('bash', [], {
  name: 'xterm-color',
  cols: 175,
  rows: 27,
  cwd: process.env.HOME,
  env: process.env,
});

  // sets the terminal prompt to pwd
ptyTerm.write(`PROMPT_COMMAND='PS1=$(pwd)" $ "'\r`);
// ptyTerm.write(`. ~/.profile \n`);
process.once('message', () => {
  animationDataSchema.dataSchema(process.env.HOME);
});
process.on('message', (data) => {
  if (data.message.cols) {
    ptyTerm.resize(data.message.cols, data.message.rows);
  } else {
    console.log('in else');
    ptyTerm.write(data.message);
    ptyTerm.removeAllListeners('data');
    ptyTerm.on('data', (ptyData) => {
			// crude way to find path, need to improve
      console.log('getting data from pty term', ptyData);
      process.send({
        data: ptyData,
      });
      const re = /\s[$]\s/g;
      if (ptyData.match(re)) {
        let temp = ptyData;
        temp = temp.replace(re, '');
        currDir = temp;
        animationDataSchema.dataSchema(currDir);
        getGitData.gitHistory(currDir);
      }
    });
  }
});
