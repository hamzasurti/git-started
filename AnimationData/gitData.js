/* eslint-disable no-console */

const exec = require('child_process').exec;

module.exports = {
  gitHistory(pwd) {
    // const that = this;
    // We can remove the max count below if desired: --max-count=10
    const commandForGitHistory = `cd ${pwd};git log --pretty="%h|%p|%s|%d"gi`;
    exec(commandForGitHistory, (err, stdout) => {
      if (err) {
        console.log(err.toString());
      } else {
        // splits stdout git log string by new line character
        const stdoutArr = stdout.split('\n');
        // makes each string in stdoutArr a subarray slit at |
        const nestedCommitArr = stdoutArr.map((element) => element.split('|'));
        // nestedCommitArr = nestedCommitArr.reverse();
        // var gitGraph = that.createGraph(nestedCommitArr);
        const graphObj = { gitGraph: nestedCommitArr };
        process.send(graphObj);
        // console.log(graphObj);
      }
    });
  },
};
