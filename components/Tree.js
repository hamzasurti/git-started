import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var treeVisualization = {};

// Set the attributes for nodes that are new to the DOM, including placing them in their initial position (x0, y0).
treeVisualization.enter = (selection, duration) =>{
  // Translate this node d.y0 units right and d.x0 units down.
  selection.attr("transform", function(d) { return "translate(" + d.y0 + "," + d.x0 + ")"; });
  // .on("click", click);

  selection.select("circle")
    .attr("r", 1e-6)
    // Right now,the d._children property is undefined (because we haven't added it). Do we need the next line?
    .style("fill", function(d) { return d._children ? "lightsteelblue" : d.level; });

  selection.select("text")
    .attr("x", function(d) { return d.children || d._children ? -20 : 20; }) // had 13 rather than 20
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);

  treeVisualization.update(selection, duration);
}

// Transition new and updated nodes to their new position
treeVisualization.update = (selection, duration) => {
  var transition = selection.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  transition.select("circle")
    .attr("r", function(d) { return d.value ? d.value : 5; })
    .style("fill", function(d) {
      var color = d._children ? "lightsteelblue" : d.level;
      console.log(`${d.name} | ${color}`)
      return color; });

  transition.select("text")
    .style("fill-opacity", 1);
}

export default class Tree extends Component {

  componentDidMount() {
  this.d3Node = d3.select(ReactDOM.findDOMNode(this));
  this.d3Node.datum(this.props.data)
    .call(treeVisualization.enter, this.props.duration);
  }
  //
  // I need to add a shouldComponentUpdate function. I could use the Medium blog post for inspiration, but I'd need to create a data.update property (not just copy-paste the Medium code).
  //
  // shouldComponentUpdate(nextProps) {
  //   console.log('sCU running for', nextProps);
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
   this.d3Node.datum(this.props.data)
    .call(treeVisualization.update, this.props.duration);
  }

  componentWillUnmount() {
    // Based on the Medium post, I'm not sure there's a good way to fade the exiting nodes out. But perhaps I could re-style them with componentDidUpate and then remove them or something?
  }

  // I had the className 'Tree' before.
  render() {
    return <g className='node'>
      <circle></circle>
      <text>{this.props.data.name}</text>
    </g>
  }
}
