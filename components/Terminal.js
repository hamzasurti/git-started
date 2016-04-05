import React, { Component } from 'react';
const Term = require('term.js');
const ReactDOM = require('react-dom');
// pty is a low-level terminal spawner: https://github.com/chjj/pty.js. Do we need it?
// const pty = require('pty.js');

export default class Terminal extends Component {

  componentDidMount() {
    const mountTerm = ReactDOM.findDOMNode(this);
    this.renderTerm(mountTerm);
  }

  buildStyle(lessonVisible) {
    const style = { float: 'left', height: '100%', backgroundColor: 'black' };
    style.width = lessonVisible ? '65%' : '100%';
    return style;
  }

  // handleResize(e) {
  //   var columns = (document.getElementById('Terminal').offsetWidth/ 6.71)-1;
  // }
  //
  // componentWillUnmount() {
  //   document.getElementById('Terminal').removeEventListener('resize', this.handleResize);
  // }

  renderTerm(elem) {
    const $Terminal = document.getElementById('Terminal');
    const columns = ($Terminal.offsetWidth / 6.71) - 1;
    const numRows = Math.floor($Terminal.offsetHeight / 12.3);
    const term = new Term({ // creates a new term.js terminal
      cursorBlink: true,
      useStyle: true,
      cols: columns,
      rows: numRows,
    });

    term.open(elem);
    // const ptyProcess = pty.fork('bash', [], { // Do we still need this?
    //   cwd: process.env.HOME,
    //   env: process.env,
    //   name: 'xterm-256color',
    // });

    ipcRenderer.once('term-start-data', (e, arg) => {
      term.write(arg);
    });
    term.on('data', (data) => {
      ipcRenderer.send('command-message', data);
    });

    ipcRenderer.on('terminal-reply', (event, arg) => {
      term.write(arg);
    });
    window.addEventListener('resize', () => {
      const cols = Math.ceil(($Terminal.offsetWidth / 6.71) - 1);
      const rows = Math.floor($Terminal.offsetHeight / 12.3);
      const sizeObj = { cols, rows };
      term.resize(cols, rows);
      ipcRenderer.send('command-message', sizeObj);
    });
  }

  render() {
    const style = this.buildStyle(this.props.lessonVisible);
    return (
      <div id="Terminal" style={style}>
      </div>
    );
  }
}

Terminal.propTypes = {
  lessonVisible: React.PropTypes.bool,
};
