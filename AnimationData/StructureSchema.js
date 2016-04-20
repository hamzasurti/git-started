/* eslint-disable no-param-reassign */
'use strict';

const exec = require('child_process').exec;
const simpleGit = require('simple-git');
const path = require('path');

const container = {
  css: null,
  html: null,
  js: null,
  rb: null,
  py: null,
  json: null,
  pdf: null,
  png: null,
};

function modifiedAnimation(info, object, item, string) {
  for (let i = 0, len = info.length; i < len; i++) {
    if (info[i].indexOf(item) > -1) {
      object.level = '#ccc';
      object.icon = `assets/64pxRed/${string}.png`;
      return;
    }
  }
  return;
}

function terminalParse(item, object) {
  let itemParse;
  if (item[item.length - 1] === '/') {
    itemParse = 'folder';
    object.name = item.substring(0, item.length - 1);
    object.type = 'directory';
    object.icon = 'assets/64pxBlue/folder.png';
  } else {
    itemParse = item.replace(/^\w+./, '');
    if (!(itemParse in container)) itemParse = 'file';
    object.icon = `assets/64pxBlue/${itemParse}.png`;
    return itemParse;
  }
  return itemParse;
}

const schemaMaker = (termOutput, directoryName, modified) => {
  let schema = {
    name: directoryName,
    children: [],
    position_x: '-10px',
    position_y: '-20px',
    value: 40,
    icon: 'assets/64pxBlue/folder.png',
    level: '#ccc',
  };

  // Loop through reply and put it into a structure D3 can read
  termOutput.forEach(index => {
    if (index === '' || (index[0] === '.' && index.substring(0, 4) !== '.git')) return undefined;
    const elementObj = {
      name: index,
      level: '#ccc',
    };
    if (index.substring(0, 4) === '.git') {
      if (index.substring(index.length - 1) === '/') {
        elementObj.icon = 'assets/folder.png';
        elementObj.name = index.substring(0, index.length - 1);
      } else {
        elementObj.icon = 'assets/git.png';
      }
      schema.children.push(elementObj);
      return undefined;
    }

    const temp = terminalParse(index, elementObj);
    if (modified) modifiedAnimation(modified, elementObj, index, temp);
    schema.children.push(elementObj);
    return undefined;
  });
  schema = [schema];
  return schema;
};

module.exports = {
  dataSchema(pwd, asyncWaterfallCallback) {
    // child process that gets all items in a directory
    const command = `cd ${pwd}; ls -ap;`;

    exec(command, (err, stdout) => {
      const stdoutArr = stdout.split('\n');
      const currentDirectoryName = path.parse(pwd).name;
      let modifiedFiles;
      // git command to check git status
      simpleGit(pwd).status((error, i) => {
        modifiedFiles = i.modified;
        const schema = schemaMaker(stdoutArr, currentDirectoryName, modifiedFiles);
        process.send ? process.send({ schema }) : asyncWaterfallCallback(null, schema);
        return schema;
      });
    });
  },
};
