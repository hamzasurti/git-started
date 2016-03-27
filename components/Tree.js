import React, {Component} from 'react';
import treeVisualization from './../visualizations/tree-visualization';
var d3 = require('d3');
var ReactDOM = require('react-dom');

export default class Tree extends Component {

  componentDidMount() {
    // this is the Tree component
    // this.d3Node is an array of elements D3 can operate on
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.enter, this.props.duration);
  }
  //
  // We could add a shouldComponentUpdate function (using the Medium blog post for inspiration) to make it so that only trees with new data are updated.
  //
  componentDidUpdate() {
    // I added the next line because for some reason this.d3Node isn't defined for isaacdurand folders.
    if (!this.d3Node) this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.update, this.props.duration);
  }

  // componentWillUnmount() {
    // Based on the Medium post, I'm not sure there's a good way to fade the exiting nodes out. But perhaps I could re-style them with componentDidUpate and then remove them or something?
  // }

  // I had the className 'Tree' before.
  // I wanted to add an onClick function here, but that gave me trouble, possibly because of duplicate React keys.
  // More specifically, I got an "Uncaught TypeError: Cannot read property 'remove' of undefined".
  render() {
    // var regExp = new RegExp('isaacdurand')
    // if (regExp.test(this.props.data.name)) {
    //   var evil = this.props.data.name;
    //   console.log('rendering evil file', evil);
    //   for (var i = 0; i < evil.length; i ++) {
    //     console.log('char at', i, evil.charAt(i));
    //     console.log('Its code is', evil.charCodeAt(i));
    //   }
    // }
    // There is something weird at index 0.


    // if (this.props.data.name === '\risaacdurand') {
    //   // Why am I not seeing this either?
    //   console.log('rendering EVIL FOLDER', this.props.data.name);
    // // } else if (this.props.data.name === 'index.html') {
    // //   // I'm seeing this.
    // //   console.log('rendering NOT EVIL file', this.props.data.name);
    // } else {
    //   console.log('rendering', this.props.data.name, 'which is length', this.props.data.name.length); // want 11 for isaacdurand. The console told me that isaacdurand is 12 characters long. WTF?
    // }

    return <g className='node' id={this.props.data.name} >
      <circle></circle>
      <text>{this.props.data.name}</text>
    </g>
  }
}
