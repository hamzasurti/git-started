import React, {Component} from 'react';
const Term = require('term.js');
var ReactDOM = require('react-dom');
// const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js



export default class Terminal extends Component {

  componentDidMount(){
    var mountTerm = ReactDOM.findDOMNode(this);
    this.renderTerm(mountTerm);
  }

  handleResize(e) {
  var columns = (document.getElementById('Terminal').offsetWidth/ 6.71)-1;

  }

  componentWillUnmount() {
  document.getElementById('Terminal').removeEventListener('resize', this.handleResize);
  }

  renderTerm(elem){
    var columns = (document.getElementById('Terminal').offsetWidth / 6.71)-1;
    var rows = Math.floor(document.getElementById('Terminal').offsetHeight / 17.5); // Need to revise this?
    const term = new Term({ // creates a new term.js terminal
      cursorBlink: true,
      useStyle: true,
      cols: columns,
      rows: rows
    });

    term.open(elem);
    var ptyProcess = pty.fork('bash', [], {
      cwd: process.env.HOME,
      env: process.env,
      name: 'xterm-256color'
    });

    ipcRenderer.once('term-start-data', (e, arg) => {
      term.write(arg)
    });
    term.on("data", function(data) {
      ipcRenderer.send('command-message', data);
    });

    ipcRenderer.on('terminal-reply', (event, arg) => {
      term.write(arg);
    });
    window.addEventListener('resize',(e) => {
      var cols = Math.ceil((document.getElementById('Terminal').offsetWidth/ 6.71)-1);
      var rows = Math.floor(document.getElementById('Terminal').offsetHeight / 17.5);
      var sizeObj = {
        cols: cols,
        rows: rows
      }
      term.resize(cols,rows);
      ipcRenderer.send('command-message',sizeObj)
    });
  }

  // Do we need a div.padding here?
  render() {
    return (
      <div id='Terminal' style={this.props.style}>
      </div>
    )
  }
}

var renderTerm = (elem) =>{
  const term = new Term({ // creates a new term.js terminal
    cursorBlink: true,
    useStyle: true,
    cols: 100,
    rows: 20
  });
  term.open(elem);
  var ptyProcess = pty.fork('bash', [], {
    cwd: process.env.HOME,
    env: process.env,
    name: 'xterm-256color'
  });

  ipcRenderer.once('term-start-data', (e, arg) => {
    term.write(arg)
  });
  term.on("data", function(data) {
    ipcRenderer.send('command-message', data);
  });

  ipcRenderer.on('terminal-reply', (event, arg) => {
   term.write(arg);
  });
}
