/* eslint-disable no-undef */
// We don't need to define ipcRenderer because it will be loaded by the time this file runs.
import React, { Component } from 'react';
import gitVisualization from './../visualizations/git-visualization.js';

export default class GitAnimation extends Component {

  componentDidMount() {
    ipcRenderer.send('ready-for-git', '\n');
    ipcRenderer.on('git-graph', (event, nestedCommitArr) => {
      gitVisualization.renderGraph(gitVisualization.createGraph(nestedCommitArr));
    });
    window.updateCommitMessage = message => { this.refs.message.textContent = message; };
  }

  buildStyle() {
    return { color: 'blue' };
  }

  render() {
    const style = this.buildStyle();

    return (
      <div id="Git-Animation">
        <p>Hover over any commit in your Git history to see the commit message.</p>
        <p>Commit message: <strong id="message" ref="message" style={style}></strong></p>
          <div>
              <svg height="80" width="100%" id="git-svg">
                  <g transform="translate(20, 20)" id="git-g" />
              </svg>
          </div>
      </div>
    );
  }
}
