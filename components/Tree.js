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
      .call(treeVisualization.enter, treeVisualization.duration);
  }
  //
  // We could add a shouldComponentUpdate function (using the Medium blog post for inspiration) to make it so that only trees with new data are updated.
  //
  componentDidUpdate() {
    // I added the next line because for some reason this.d3Node isn't defined for isaacdurand folders.
    if (!this.d3Node) this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.update, treeVisualization.duration);
  }
  //
  // componentWillUnmount() {
    // Based on the Medium post, I'm not sure there's a good way to fade the exiting nodes out. But perhaps I could re-style them with componentDidUpate and then remove them or something?
  // }
  //
  // *** Can I do an onClick here now that I'm not getting an invariant error?
  // If I add an onClick function here, it will receive a synthetic mouse event as its first argument. Is that useful?
  render() {
    return <g className='node' id={this.props.data.name}>
      <circle onClick={treeVisualization.handleClick}></circle>
      <text>{this.props.data.name}</text>
    </g>
  }
}
