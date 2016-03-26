import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var linkVisualization = {};

// Set the attributes for links that are new to the DOM
linkVisualization.enter = (selection, diagonal, duration) => {
  selection.attr("d", function(d) {
    // What is the o doing?
  var o = {x: d.target.x0, y: d.target.y0};
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

linkVisualization.exit = (selection, diagonal, duration) => {
  selection.transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: d.source.x, y: d.source.y};
    return diagonal({source: o, target: o});
    })
}

export default class Path extends Component {

  componentDidMount() {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.enter, this.props.diagonal, this.props.duration);
  }

  // We could add a shouldComponentUpdate function (using the Medium blog post for inspiration) to make it so that only links with new data are updated.

  // I don't think we'll actually be able to test this until we're showing 3+ levels. (With only two levels, links never persist.)
  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(linkVisualization.update, this.props.diagonal, this.props.duration);
  }

  // I had the className capitalized before
  // If I add an onClick function here, it will receive a synthetic mouse event as its first argument.
  render() {
    var id = 'linkTo' + this.props.data.target.name;
    return <path className='link' id={id}></path>
  }
}
