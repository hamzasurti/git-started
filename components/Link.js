import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

// Import the d3 functions we'll use to visualize our links.
import linkVisualization from './../visualizations/link-visualization';

export default class Path extends Component {
  componentDidMount() {
    // This function runs when a new path is added to the DOM.
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.enter, linkVisualization.diagonal, linkVisualization.duration);
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.update, linkVisualization.diagonal, linkVisualization.duration);
  }

  buildStyle() {
    return { fill: 'none', stroke: '#ccc', strokeWidth: '1.5px' };
  }

  render() {
    const id = `linkTo${this.props.data.target.name}`;
    const style = this.buildStyle();

    return <path id={id} style={style}></path>;
  }
}

Path.propTypes = {
  data: React.PropTypes.object,
};
