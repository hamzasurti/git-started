import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

// Import the d3 functions we'll use to visualize our trees.
import treeVisualization from './../visualizations/tree-visualization';

export default class Tree extends Component {

  componentDidMount() {
    // This function runs when a new file/folder is added to the DOM.
    // this.d3Node is a d3 selection - an array of elements D3 can operate on.
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.enter, treeVisualization.duration);
  }

  componentDidUpdate() {
    // This function runs when a file/folder already on the DOM is updated.
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.update, treeVisualization.duration);
  }

  buildStyles() {
    const styles = {};

    styles.main = { cursor: 'pointer' };
    styles.image = { fill: '#fff', stroke: 'steelblue', strokeWidth: '1.5px' };
    styles.text = { font: '10px sans-serif' };

    return styles;
  }

  render() {
    const styles = this.buildStyles();

    return (
      <g style={styles.main} id={this.props.data.name}>
       <image style={styles.image} onClick={treeVisualization.handleClick}></image>
       <text style={styles.text}>{this.props.data.name}</text>
     </g>
   );
  }
}

Tree.propTypes = {
  data: React.PropTypes.object,
};
