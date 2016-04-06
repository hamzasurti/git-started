const d3 = require('d3');
import linkVisualization from './link-visualization';

var treeVisualization = {};

treeVisualization.duration = linkVisualization.duration;

treeVisualization.handleClick = (d) => {
  var parentNode = d3.select(d.target.parentNode);
  var parentData = parentNode.datum();

  // If the clicked node has children...
  if (parentData.children) {
    // Decide how to update the children and their links.
    // If the children and their links are hidden, show them. If they're showing, hide them.
    var treeFunction = parentData.childrenHidden ? treeVisualization.update : treeVisualization.hide;
    var linkFunction = parentData.childrenHidden ? linkVisualization.enter : linkVisualization.exit;

    // Loop through the children/links and update them.
    parentData.children.forEach(child => {
      // Is there a better way to select the DOM elements I need, without using document.getElementById?
      // I understand how to go from DOM element to data in D3, but not vice versa.
      var treeNode = d3.select(document.getElementById(child.name));
      // console.log('treeNode', treeNode);
      // console.log('treeNode.datum().stagger', treeNode.datum().stagger); // Pass this as stagger
      treeNode.call(treeFunction, treeVisualization.duration);
      var linkNode = d3.select(document.getElementById(`linkTo${child.name}`));
      linkNode.call(linkFunction, linkVisualization.diagonal, treeVisualization.duration);
    });

    // Update the parent.
    parentData.childrenHidden = !parentData.childrenHidden;
    parentNode.call(treeVisualization.update, treeVisualization.duration);
  }
}

// Hide child nodes by collapsing them into their parent.
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
  selection.attr("transform", function(d) { return "translate(" + d.y0 + "," + d.x0 + ")"; });

  selection.select("circle")
    .attr("r", 1e-6);

  selection.select("text")
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
      return d.childrenHidden ? "lightsteelblue" : d.level || "#fff"; });

  transition.select("text")
    .attr("x", function(d) { return d.children || d.childrenHidden ? -20 : 20; }) // had 13 rather than 20
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d.childrenHidden ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1);
}

export default treeVisualization;
