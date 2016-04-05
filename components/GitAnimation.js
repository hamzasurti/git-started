/* eslint-disable no-console */
import React, { Component } from 'react';
// import { createStore } from 'redux'; // We may use this later.

export default class GitAnimation extends Component {
  componentDidMount() {
    // ipcRenderer.send('ready-for-git', '\n');
    ipcRenderer.on('git-graph', (event, arg) => {
      // The arg is an object with an array of names (strings) and vertices (objects).
      console.log('git-graph', arg);
      this.buildGraph(arg);
      // this.gitGraphMaker(arg);
    });
  }

  buildGraph(data) {
    const result = {};
    const nodes = [];
    const links = [];
    const names = data.names;
    const vertices = data.vertices;
    let linkNum = 1;

    // Set a name.
    result.name = 'Git Graph';

    // For each commit in the names array...
    for (let i = 0; i < names.length; i++) {
      // Create a node and push it to the nodes array.
      const node = {};
      const hash = names[i];
      node.id = hash;
      node.value = {};
      node.value.label = hash;
      nodes.push(node);

      // Create a link for each of the commit's parents and push it to the links array.
      const parents = vertices[hash].incomingNames;
      for (let j = 0; j < parents.length; j ++) {
        const link = {};
        link.u = hash; // child/source
        link.v = parents[j]; // parent/target
        link.value = {};
        link.value.label = `link ${linkNum}`;
        console.log(link.value.label);
        links.push(link);
        linkNum ++;
      }
    }

    result.nodes = nodes;
    result.links = links;
    console.log('result:', result);
    return result;
  }

  // gitGraphMaker(dag) {
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
  // }

  render() {
    return (
      // JSX
      <div>We will show a Git animation here
        <canvas id="gitGraph"></canvas>
      </div>
    );
  }
}
