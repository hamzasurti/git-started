import React, {Component} from 'react';
import linkVisualization from './../visualizations/link-visualization';
var d3 = require('d3');
var ReactDOM = require('react-dom');

export default class Path extends Component {

  componentDidMount() {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.enter, linkVisualization.diagonal, this.props.duration);
  }

  // We could add a shouldComponentUpdate function (using the Medium blog post for inspiration) to make it so that only links with new data are updated.

  // I don't think we'll actually be able to test this until we're showing 3+ levels. (With only two levels, links never persist.)
  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.update, linkVisualization.diagonal, this.props.duration);
  }

  // I had the className capitalized before
  // If I add an onClick function here, it will receive a synthetic mouse event as its first argument.
  render() {
    var id = 'linkTo' + this.props.data.target.name;
    return <path className='link' id={id}></path>
  }
}
