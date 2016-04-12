import React, { Component } from 'react';
const Term = require('term.js');
const ReactDOM = require('react-dom');

export default class Terminal extends Component {

  componentDidMount() {
    const mountTerm = ReactDOM.findDOMNode(this);
    this.renderTerm(mountTerm);
  }

  buildStyle(lessonVisible) {
    const style = { float: 'left', height: '100%', backgroundColor: '#151414' };
    style.width = lessonVisible ? '65%' : '100%';
    return style;
  }

  renderTerm(elem) {
    const $Terminal = document.getElementById('Terminal');
    const columns = ($Terminal.offsetWidth / 6.71) - 1;
    const numRows = Math.floor($Terminal.offsetHeight / 18); //should defoulst to 17
    console.log(numRows);
    const term = new Term({ // creates a new term.js terminal
      cursorBlink: true,
      useStyle: true,
      cols: columns,
      rows: 1,
    });

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
    return (
      <div id="Terminal" style={style}>
      </div>
    );
  }
}


Terminal.propTypes = {
  lessonVisible: React.PropTypes.bool,
};
