/* eslint-disable no-console */

import React, { Component } from 'react';
import visualizeGit from './../visualizations/git-visualization.js';
const DAG = require('../AnimationData/DAG'); // Can we import instead?

export default class GitAnimation extends Component {

  componentDidMount() {
    ipcRenderer.send('ready-for-git', '\n');
    ipcRenderer.on('git-graph', (event, nestedCommitArr) => {
      // The arg is an object with an array of names (strings) and vertices (objects).
      const graph = this.createGraph(nestedCommitArr);
      const graph2 = this.buildGraph(graph);
      // console.log('graph', graph);
      visualizeGit(graph2);
      ipcRenderer.send('dag-data', graph2); // for testing only
      // this.gitGraphMaker(arg);
    });
  }

  createGraph(nestedCommitArr) {
    const gitGraph = new DAG();
    for (let i = 0; i < nestedCommitArr.length - 1; i++) {
      if (nestedCommitArr[i][1].match(/\s/)) {
        nestedCommitArr[i][1] = nestedCommitArr[i][1].split(/\s/);
      }
      gitGraph.addEdges(nestedCommitArr[i][0], nestedCommitArr[i][2], null, nestedCommitArr[i][1]);
    }
    return gitGraph;
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
      // The line below seems not to like null values.
      node.value.label = hash;
      node.value.message = vertices[hash].value || 'No commit message available';
      nodes.push(node);

      // Create a link for each of the commit's parents and push it to the links array.
      const parents = vertices[hash].incomingNames;
      for (let j = 0; j < parents.length; j ++) {
        const link = {};
        link.u = hash; // child/source
        link.v = parents[j]; // parent/target
        link.value = {};
        link.value.label = `link ${linkNum}`;
        links.push(link);
        linkNum ++;
      }
    }

    result.nodes = nodes;
    result.links = links;
    // console.log('result:', result);
    return result;
  }

  buildStyle() {
    return { color: 'blue' };
  }

  render() {
    const style = this.buildStyle();
    return (
      <div id="Git-Animation">
        <p>Hover over any commit in your Git history to see the commit message.</p>
        <p>Commit message: <strong id="message" style={style}></strong></p>
          <div>
              <svg height="80" width="100%" id="git-svg">
                  <g transform="translate(20, 20)" id="git-g"/>
              </svg>
          </div>
      </div>
    );
  }
}

// had graphElem in inner div
