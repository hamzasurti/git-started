
import React, {Component} from 'react';
const DAG = require('../AnimationData/DAG');


/* eslint-disable no-console */


export default class GitAnimation extends Component {

  componentDidMount() {
    ipcRenderer.on('git-graph', (event, arg) => {
      this.createGraph(arg);
    });
  }

	createGraph(nestedCommitArr) {
   var gitGraph = new DAG();
		for (var i = 0; i < nestedCommitArr.length - 1; i++) {
			if (nestedCommitArr[i][1].match(/\s/)){
				nestedCommitArr[i][1] = nestedCommitArr[i][1].split(/\s/)
			}
			gitGraph.addEdges(nestedCommitArr[i][0],nestedCommitArr[i][2],null, nestedCommitArr[i][1]);
		}
		console.log(gitGraph);
		return gitGraph;
	}

  render() {
    return (
      // JSX
      <div>We will show a Git animation here
        <canvas id="gitGraph"></canvas>
      </div>
    );
  }
}
