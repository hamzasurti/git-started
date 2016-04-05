import React, { Component } from 'react';
import treeVisualization from './../visualizations/tree-visualization';
const d3 = require('d3');
const ReactDOM = require('react-dom');

export default class Tree extends Component {

  componentDidMount() {
    // This function runs when a new file/folder is added to the DOM.
    // this.d3Node is an array of elements D3 can operate on (a selection).
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.enter, treeVisualization.duration);
  }
  //
  // We could add a shouldComponentUpdate function (using the Medium blog post for inspiration)
  // to make it so that only trees with new data are updated.
  // However, this many not be necessary.
  //
  componentDidUpdate() {
    // This function runs when a file/folder already on the DOM is updated.
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.update, treeVisualization.duration);
  }

  buildStyles() {
    const styles = {};

    styles.main = { cursor: 'pointer' };
    // Should this be in treeVisualization?
    styles.circle = { fill: '#fff', stroke: 'steelblue', strokeWidth: '1.5px' };
    styles.text = { font: '10px sans-serif' };

    return styles;
  }

  render() {

    const styles = this.buildStyles();

    return (
      <g style={styles.main} id={this.props.data.name}>
       <circle style={styles.circle} onClick={treeVisualization.handleClick}></circle>
       <text style={styles.text}>{this.props.data.name}</text>
     </g>
   );
  }
}

Tree.propTypes = {
  data: React.PropTypes.object,
};
