import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var linkVisualization = {};

// Set the attributes for links that are new to the DOM
linkVisualization.enter = (selection, diagonal, duration) => {
  selection.attr("d", function(d) {
    // What is the o doing?
  var o = {x: d.target.rootX0, y: d.target.rootY0};
  // console.log('this', this); // this is a <path>
  return diagonal({source: o, target: o});
  });

  linkVisualization.update(selection, diagonal, duration);
}

// Transition new and updated links to their new position
linkVisualization.update = (selection, diagonal, duration) => {
  selection.transition()
    .duration(duration)
    .attr("d", diagonal);
}

export default class Path extends Component {

  componentDidMount() {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.enter, this.props.diagonal, this.props.duration);
  }

  // need shouldComponentUpdate

  // I don't think we'll actually be able to test this until we're showing 3+ levels. (With only two levels, links never persist.)
  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.update, this.props.diagonal, this.props.duration);
  }

  // I had the className capitalized before
  render() {
    return <path className='link'></path>
  }
}
