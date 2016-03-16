import React, {Component} from 'react';
const Term = require('term.js');
var ReactDOM = require('react-dom');
// const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js



export default class Terminal extends Component {

  componentDidMount(){
    var mountTerm = ReactDOM.findDOMNode(this);
    console.log('hmmm');
    renderTerm(mountTerm);
  }

  render() {
    return (
      <div id='Terminal'>
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
console.log('hi');
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
