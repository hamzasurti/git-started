/* eslint-disable no-undef */
// We don't need to define ipcRenderer because it will be loaded by the time this file runs.

import React, { Component } from 'react';
const Term = require('term.js');
const ReactDOM = require('react-dom');

export default class Terminal extends Component {
  // Once the Terminal component mounts, append a terminal emulator to it.
  componentDidMount() {
    const mountTerm = ReactDOM.findDOMNode(this);
    this.renderTerm(mountTerm);
  }

  buildStyle(lessonVisible) {
    const style = { float: 'left', height: '100%', backgroundColor: '#151414',
     borderColor: '#151414', zIndex: 3 };
    style.width = lessonVisible ? '65%' : '100%';
    return style;
  }

  renderTerm(elem) {
    // Determine how many rows and columns the terminal emulator should have, based on the size of
    // the Terminal component.
    const $Terminal = document.getElementById('Terminal');
    const columns = ($Terminal.offsetWidth / 6.71) - 1;
    const numRows = Math.floor($Terminal.offsetHeight / 18);

    // Create a new term.js terminal emulator.
    const term = new Term({
      cursorBlink: true,
      useStyle: true,
      cols: columns,
      rows: numRows,
    });

    // Append it to the Terminal component.
    term.open(elem);

    ipcRenderer.once('term-start-data', (e, arg) => {
      term.write(arg);
    });

    term.on('data', (data) => {
      ipcRenderer.send('command-message', data);
    });

    ipcRenderer.on('terminal-reply', (event, arg) => {
      term.write(arg);
    });

    // Resize the terminal emulator when the window resizes.
    window.addEventListener('resize', () => {
      const cols = Math.ceil(($Terminal.offsetWidth / 6.71) - 1);
      const rows = Math.floor($Terminal.offsetHeight / 18);
      const sizeObj = { cols, rows };
      term.resize(cols, rows);
      ipcRenderer.send('command-message', sizeObj);
    });
  }

  render() {
    const style = this.buildStyle(this.props.lessonVisible);
    return <div id="Terminal" style={style}></div>;
  }
}

Terminal.propTypes = {
  lessonVisible: React.PropTypes.bool,
};
