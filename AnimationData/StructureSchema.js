/* eslint-disable no-console */

'use strict';
const exec = require('child_process').exec;
const simpleGit = require('simple-git');
const path = require('path');


function schemaMaker(termOutput, directoryName, modified) {
  let schema = {
    name: directoryName,
    children: [],
    value: 15,
    level: '#33C3F0',
  };
  // loops through reply and puts it in D3 readable structure
  termOutput.forEach((index) => {
    // checks if file has any alphanumeric characters
    const elementObj = { name: index };
    if (index.substring(index.length - 1) === '/') elementObj.level = '#33C3F0';
    if (index.substring(0, 4) === '.git' || !!index.match(/^\w/)) {
      // makes .git foldrs black
      if (index.substring(0, 4) === '.git') elementObj.level = 'black';
      if (modified) {
        for (let i = 0; i < modified.length; i++) {
          if (modified[i] === index) {
            elementObj.level = 'red';
          }
        }
      }
      schema.children.push(elementObj);
    }
  });
  schema = [schema];
  return schema;
}
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
