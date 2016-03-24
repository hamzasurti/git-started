import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var treeVisualization = {};

treeVisualization.enter = (selection, duration) =>{
  // selection is equivalent to nodeEnter
  selection.attr("transform", function(d) {
      // console.log('this', this); // this is the <g> element, not a node.
      // console.log('selection', selection); // I think this is a node
      return "translate(" + d.rootY0 + "," + d.rootX0 + ")"; })
    // need to add onclick function

  selection.select("circle")
    .attr("r", 1e-6)
    // I checked, and this style is being applied!
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  selection.select("text")
    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  // transition is equivalent to nodeUpdate. What about nodeExit?
  var transition = selection.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  transition.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  transition.select("text")
    .style("fill-opacity", 1);
}

treeVisualization.update = (selection, duration) => {
  // Move the tree here. First make cWU or something call it.
}

export default class Tree extends Component {

  componentDidMount() {
    console.log(`${this.props.data.name} did mount`);
  this.d3Node = d3.select(ReactDOM.findDOMNode(this)); // ReactDOM.findDOMNode(this) returns <g.Tree>
  this.d3Node.datum(this.props.data)
    .call(treeVisualization.enter, this.props.duration);
  //
  // // Do this stuff here? Or in helper function?
  // // Set root.x0 and root.y0
  // // Set data.y for each node
  // // Select g.Trees and bind them to nodes based on d.id? Have I already done this?
  // // Update node attributes
  }
  //
  // shouldComponentUpdate(nextProps) {
  //   console.log('sCU running for', nextProps); // currently, this function isn't running at all
  //  if (nextProps.data.update) { // what is nextProps.data.update?
  //   // use d3 to update component
  //   this.d3Node.datum(nextProps.data)
  //    .call(treeVisualization.update);
  //   return false;
  //  }
  //  return true;
  // }
  //
  componentDidUpdate() {
    console.log(`***${this.props.data.name} did update`);
   this.d3Node.datum(this.props.data)
    .call(treeVisualization.enter, this.props.duration); // change to .update
  }

  componentWillUnmount() {
    console.log(`${this.props.data.name} will unmount`);
  }

  // I think I want to use this.props.data.name instead of this.props.name...
  // I had the className 'Tree' before.
  render() {
    return <g className='node'>
      <circle></circle>
      <text>{this.props.data.name}</text>
    </g>
  }
}
