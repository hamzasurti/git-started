import React, {Component} from 'react';
const Term = require('term.js');
var ReactDOM = require('react-dom');
// const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js



export default class Terminal extends Component {

  componentDidMount(){
    var mountTerm = ReactDOM.findDOMNode(this);
    this.renderTerm(mountTerm);
  }

  // handleResize(e) {
  //   var columns = (document.getElementById('Terminal').offsetWidth/ 6.71)-1;
  // }
  //
  // componentWillUnmount() {
  //   document.getElementById('Terminal').removeEventListener('resize', this.handleResize);
  // }

  buildStyles(lessonVisible) {
    const style = { float: 'left', height: '100%', backgroundColor: 'black' };
    style.width = lessonVisible ? '65%' : '100%';
    return style;
  }

  // Pull document.getElementById('Terminal') into a variable.
  renderTerm(elem){
    var columns = (document.getElementById('Terminal').offsetWidth / 6.71)-1;
    var rows = Math.floor(document.getElementById('Terminal').offsetHeight / 12.3);
    console.log('hello');
    const term = new Term({ // creates a new term.js terminal
      cursorBlink: true,
      useStyle: true,
      cols: columns,
      rows: rows
    });

    term.open(elem);
    var ptyProcess = pty.fork('bash', [], { // Do we still need this?
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
      var rows = Math.floor(document.getElementById('Terminal').offsetHeight / 12.3);
      var sizeObj = { // see ES6 object enhanced literal syntax
        cols: cols,
        rows: rows
      }
      term.resize(cols,rows);
      ipcRenderer.send('command-message',sizeObj)
    });
  }

  // Do we need a div.padding here?
  render() {
    const style = this.buildStyles(this.props.lessonVisible);
    return (
      <div id="Terminal" style={style}>
      </div>
    )
  }
}
