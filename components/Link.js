import React, { Component } from 'react';
import linkVisualization from './../visualizations/link-visualization';
const d3 = require('d3');
const ReactDOM = require('react-dom');

export default class Path extends Component {

  componentDidMount() {
    // This function runs when a new path is added to the DOM.
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.enter, linkVisualization.diagonal, linkVisualization.duration);
  }

  // We could add a shouldComponentUpdate function (using the Medium blog post for inspiration)
  // to make it so that only links with new data are updated.
  // However, this might not be necessary.

  // I don't think we'll actually be able to test this until we're showing 3+ levels.
  // (With only two levels, links never persist.)
  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.update, linkVisualization.diagonal, linkVisualization.duration);
  }

  render() {
    const id = `linkTo${this.props.data.target.name}`;
    return <path className="link" id={id}></path>;
  }
}

Path.propTypes = {
  data: React.PropTypes.object,
};
