/* eslint-disable strict */

'use strict';

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

// Set the terminal prompt to pwd.
// We can read the bash profile here with the source command.
ptyTerm.write(`PROMPT_COMMAND='PS1=$(pwd)" $ "'\r`);
ptyTerm.write('clear \r');

process.once('message', () => animationDataSchema.dataSchema(process.env.HOME));

process.on('message', data => { if (!data.message.cols) ptyTerm.write(data.message); });

ptyTerm.on('data', data => {
  // Find path
  process.send({
    data,
  });
  const re = /\s[$]\s/g;
  if (data.match(re)) {
    let temp = data;
    temp = temp.replace(re, '');
    currDir = temp;
    process.send({ currDir });
    animationDataSchema.dataSchema(currDir);
    getGitData.gitHistory(currDir);
  }
});
