import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var treeVisualization = {};

treeVisualization.handleClick = (d) => {
  console.log('You clicked a node!');
  if (!d.children) {
    console.log("This node doesn't have any children, so nothing's gonna happen");
  } else {
    console.log('This node has children.')
    // d.children.forEach(child => treeVisualization.sayName(child));
    d.children.forEach(child => {
      var d3Node = d3.select(document.getElementById(child.name));
      // For now, I'm hard-coding the duration as 450.
      d3Node.datum(child).call(treeVisualization.hide, 450);
    });
  }
}

treeVisualization.hide = (selection, duration) => {
  selection.attr('fill', 'green');
  // .transition()
    // .duration(duration)
}

treeVisualization.sayName = (d) => {
  // console.log(document.getElementById(d.name));
  // document.body.querySelector('g .node');
}

// Set the attributes for nodes that are new to the DOM, including placing them in their initial position (x0, y0).
treeVisualization.enter = (selection, duration) =>{
  // Translate this node d.y0 units right and d.x0 units down.
  selection.attr("transform", function(d) { return "translate(" + d.y0 + "," + d.x0 + ")"; })
  .on("click", treeVisualization.handleClick);

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

  // Toggle children on click.
  // function click(d) {
  //   if (d.children) {
  //   d._children = d.children;
  //   d.children = null;
  //   } else {
  //   d.children = d._children;
  //   d._children = null;
  //   }
  // update(d); // update is no longer defined
  // }

  treeVisualization.update(selection, duration);
  // window.setTimeout(function() {
  //   treeVisualization.hideChildren(selection, duration);
  // }, duration);
}

// Transition new and updated nodes to their new position
treeVisualization.update = (selection, duration) => {
  var transition = selection.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  transition.select("circle")
    .attr("r", function(d) { return d.value ? d.value : 5; })
    .style("fill", function(d) { return d._children ? "lightsteelblue" : d.level; });

  transition.select("text")
    .style("fill-opacity", 1);
}

// treeVisualization.hideChildren = (selection, duration) => {
//   console.log('hiding');
//   var transition = selection.transition()
//     .duration(duration)
//     .attr("transform", function(d) {
//       if (d.children) return "translate( -" + d.y + ", -" + d.x + ")"; });

  // transition.select("circle")
  //   .attr("r", 1e-6);
  //
  // transition.select("text")
  //   .style("fill-opacity", 1e-6);
// }

export default class Tree extends Component {

  componentDidMount() {
    // this is the Tree component
    // this.d3Node is an array of elements D3 can operate on
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.enter, this.props.duration);
  }
  //
  // We could add a shouldComponentUpdate function (using the Medium blog post for inspiration) to make it so that only trees with new data are updated.
  //
  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(treeVisualization.update, this.props.duration);
  }

  // componentWillUnmount() {
    // Based on the Medium post, I'm not sure there's a good way to fade the exiting nodes out. But perhaps I could re-style them with componentDidUpate and then remove them or something?
  // }

  // I had the className 'Tree' before.
  // I wanted to add an onClick function here, but that gave me trouble, possibly because of duplicate React keys.
  render() {
    return <g className='node' id={this.props.data.name}>
      <circle></circle>
      <text>{this.props.data.name}</text>
    </g>
  }
}
