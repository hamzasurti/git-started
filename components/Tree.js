import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var treeVisualization = {};

treeVisualization.handleClick = (d) => {
  if (d.children) {
    // If the children are showing, hide them.
    if (!d.childrenHidden) {
      console.log('It looks like treeNode and treeNode.datum(child) return the same value. What about linkNode? It seems to be in the same format too.');
      d.children.forEach(child => {
        var treeNode = d3.select(document.getElementById(child.name));
        // For now, I'm hard-coding the duration as 450.
        // console.log('treeNode', treeNode);
        // console.log('treeNode.datum(child)', treeNode.datum(child));
        treeNode.datum(child).call(treeVisualization.hide, 450);
        var linkNode = d3.select(document.getElementById('linkTo' + child.name));
        // console.log('linkNode', linkNode);
        // console.log('linkNode.datum()', linkNode.datum());
        // Darn, the part on the next line is going to be hard - doing the data binding. Can I do this step on linkVisualization?
        var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });
        linkNode.call(treeVisualization.exitLink, diagonal, 450);

      });
      d.childrenHidden = true;
    // If the children are hidden, show them.
    } else {
      d.children.forEach(child => {
        var treeNode = d3.select(document.getElementById(child.name));
        // Is showing children the same as updating them?
        treeNode.datum(child).call(treeVisualization.update, 450);
        var linkNode = d3.select(document.getElementById('linkTo' + child.name));
      });
      d.childrenHidden = false;
    }
  }
}

treeVisualization.hide = (selection, duration) => {
  var transition = selection.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.parent.y + "," + d.parent.x + ")"; });

    transition.select("circle")
      .attr("r", 1e-6);

    transition.select("text")
      .style("fill-opacity", 1e-6);
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

  treeVisualization.update(selection, duration);
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

// Temporary
treeVisualization.exitLink = (selection, diagonal, duration) => {
  selection.transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: d.source.x, y: d.source.y};
    return diagonal({source: o, target: o});
    })
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
  // More specifically, I got an "Uncaught TypeError: Cannot read property 'remove' of undefined".
  render() {
    return <g className='node' id={this.props.data.name} >
      <circle></circle>
      <text>{this.props.data.name}</text>
    </g>
  }
}
