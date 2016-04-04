/* eslint-disable no-console */

'use strict';
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
let ptySwitch = false;
  // sets the terminal prompt to pwd
// ptyTerm.write(`PROMPT_COMMAND='PS1=$(pwd)" $ "'\r`);
ptyTerm.write(`. ~/.profile \n`);
process.once('message', () => {
  animationDataSchema.dataSchema(process.env.HOME);
});
process.on('message', (data) => {
  if (data.message.cols) {
    ptyTerm.resize(data.message.cols, data.message.rows);
  } else {
    if (data.message === '\r') {
      ptyTerm.write(data.message);
      ptyTerm.write(`pwd; echo "123456789";\r`);
    } else {
      ptyTerm.write(data.message);
    }
  }
});

ptyTerm.on('data', (ptyData) => {
  if (ptyData.match(/pwd/)) {
    console.log('pwd stuff i think ===>', ptyData);
    ptySwitch = true;
  }
  if (ptySwitch) {
    if (ptyData.match(/\r/)) {
      ptySwitch = false;
      return;
    }
		return;
  }
  const re = /\r\s123456789\s/;
  if (ptyData.match(re)) {
    const path = ptyData.replace(re, '');
    currDir = path.slice(0, -1);
    console.log('the current directory is ==>', currDir);
    animationDataSchema.dataSchema(currDir);
    getGitData.gitHistory(currDir);
  } else {
    console.log('ptyswitch', ptySwitch);
    if (!ptySwitch) process.send({ data: ptyData });
  }
});
