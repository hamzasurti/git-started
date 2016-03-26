const exec = require('child_process').exec;
const DAG = require('./DAG')

module.exports = {
  gitHistory: function(pwd){
    var that = this;
    var commandForGitHistory = 'cd ' + pwd + ';git log --pretty="%h|%p|%s|%d"';
    exec(commandForGitHistory, (err,stdout,stderr) => {
      if (err) {
        console.log(err.toString());
      } else {
        // splits stdout git log string by new line character
        var stdoutArr = stdout.split('\n');
        // makes each string in stdoutArr a subarray slit at |
        var nestedCommitArr = stdoutArr.map((element) =>{
          return element.split('|');
        })
        nestedCommitArr = nestedCommitArr.reverse();
        // console.log(nestedCommitArr);
        var gitGraph = that.createGraph(nestedCommitArr);
        process.send({gitGraph: gitGraph});
      }
    })
  },

  createGraph: function(nestedCommitArr){
    var gitGraph = new DAG();
    for (var i = 1; i < nestedCommitArr.length; i++){
      gitGraph.map(nestedCommitArr[i][0],nestedCommitArr[i][2]);
    }
    for (var j = 1; j < nestedCommitArr.length; j++) {
      if (nestedCommitArr[j][1].match(/\s/)){
        nestedCommitArr[j][1] = nestedCommitArr[j][1].split(/\s/)
        for (var k = 0; k < nestedCommitArr[j][1].length; k++) {
          console.log('the stuff with spaces +>',nestedCommitArr[j][1][k]);
          gitGraph.addEdge(nestedCommitArr[j][1][k], nestedCommitArr[j][0]);
        }
      } else {
        gitGraph.addEdge(nestedCommitArr[j][1],nestedCommitArr[j][0]);
      }
    }
    return gitGraph;
  }
}
