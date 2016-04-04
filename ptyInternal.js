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
			process.nextTick(() => {
				ptyTerm.write(`pwd; echo "123456789";\r`);
			});
    } else {
      ptyTerm.write(data.message);
    }
  }
});

ptyTerm.on('data', (ptyData) => {
	console.log('pty data is ===>', ptyData, '\n***end***');
	console.log('ptySwitch:', ptySwitch);
	const re = /\r\s123456789\s/;
  if (ptyData.match(/pwd/)) {
    console.log('pwd stuff i think ===>', ptyData);
    ptySwitch = true;
  }
  if (ptySwitch && ptyData.match(re)) {
		ptySwitch = false;
  } else if (ptySwitch) {
			if (ptyData.match(/\r/)) {
				console.log('THERE WAS A RETURN. TURN OFF PTYSWITCH?');
	      ptySwitch = false;
	      return;
	    }
			return;
	}

	console.log('matches?', ptyData, ptyData.match(re));
  if (ptyData.match(re)) {
    const path = ptyData.replace(re, '');
    currDir = path.slice(0, -1);
    console.log('the current directory is ==>', currDir);
    animationDataSchema.dataSchema(currDir);
    getGitData.gitHistory(currDir);
  } else {
    // console.log('ptyswitch', ptySwitch);
    if (!ptySwitch) process.send({ data: ptyData });
  }
});
