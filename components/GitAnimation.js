import React, {Component} from 'react';

export default class GitAnimation extends Component {

  componentDidMount(){
    console.log('jkshfdlkasfjhl');
    ipcRenderer.on('git-graph', (event, arg) => {
      // console.log(arg);
      console.log(arg);
    });
  }

  render() {

    return (
      //JSX
      <div>We will show a Git animation here

      </div>

    )
  }
}
