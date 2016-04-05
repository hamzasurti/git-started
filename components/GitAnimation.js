/* eslint-disable no-console */
import React, { Component } from 'react';
// import { createStore } from 'redux'; // We may use this later.

export default class GitAnimation extends Component {
  componentDidMount() {
    console.log('GitAnimation did mount');
    ipcRenderer.send('ready-for-git', '\n');
    ipcRenderer.on('git-graph', (event, arg) => {
      // The arg is an object with an array of names (strings) and vertices (objects).
      // console.log('git-graph', arg);
      // this.gitGraphMaker(arg);
    });
  }

  gitGraphMaker(dag) {
    // const gitgraph = new GitGraph({
    //   template: 'metro', // or blackarrow
    //   orientation: 'horizontal',
    //   author: 'John Doe',
    //   mode: 'extended', // or compact if you don't want the messages
    // });
    // console.log(dag);
    // TODO fix this ish
    // var master = gitgraph.branch("master");
    // var counter = 0;
    // for (var namehash in dag.vertices) {
    //   console.log(namehash.incomingNames);
    //   // if (namehash.incomingNames.length > 1) gitgraph.branch(namehash)
    //   gitgraph.commit(namehash + dag.vertices[dag.names[counter].value])
    //   counter++;
    // }
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
