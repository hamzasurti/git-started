/* eslint-disable no-console */

const exec = require('child_process').exec;

module.exports = {
  gitHistory(pwd) {
    const commandForGitHistory = `cd ${pwd};git log --pretty="%h|%p|%s|%d"gi`;
    exec(commandForGitHistory, (err, stdout) => {
      if (err) {
        console.log(err.toString());
      } else {
        // splits stdout git log string by new line character
        const stdoutArr = stdout.split('\n');
        // makes each string in stdoutArr a subarray split at |
        const nestedCommitArr = stdoutArr.map((element) => element.split('|'));
        const graphObj = { gitGraph: nestedCommitArr };
        process.send(graphObj);
      }
    });
  },
};
