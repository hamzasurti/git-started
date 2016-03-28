var d3 = require('d3'); // const?
import linkVisualization from './link-visualization';

var treeVisualization = {};

treeVisualization.duration = linkVisualization.duration;

treeVisualization.handleClick = (d) => {
  if (d.children) {
    // If the children are showing...
    if (!d.childrenHidden) {
      // Update the parent.
      d.childrenHidden = true;
      var parentNode = d3.select(document.getElementById(d.name));
      parentNode.call(treeVisualization.update, treeVisualization.duration);
      // Hide the children.
      d.children.forEach(child => {
        var treeNode = d3.select(document.getElementById(child.name));
        treeNode.datum(child).call(treeVisualization.hide, treeVisualization.duration);
        var linkNode = d3.select(document.getElementById('linkTo' + child.name));
        linkNode.call(linkVisualization.exit, linkVisualization.diagonal, treeVisualization.duration);
      });

    // If the children are hidden...
    } else {
      // Update the parent.
      d.childrenHidden = false;
      var parentNode = d3.select(document.getElementById(d.name));
      parentNode.call(treeVisualization.update, treeVisualization.duration);
      // Show the children.
      d.children.forEach(child => {
        var treeNode = d3.select(document.getElementById(child.name));
        treeNode.datum(child).call(treeVisualization.update, treeVisualization.duration);
        var linkNode = d3.select(document.getElementById('linkTo' + child.name));
        linkNode.call(linkVisualization.enter, linkVisualization.diagonal, treeVisualization.duration);
      });
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
    // Note from Isaac: I replaced d._children with d.childrenHidden.
    .style("fill", function(d) { return d.childrenHidden ? "lightsteelblue" : d.level; });

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
      return d.childrenHidden ? "lightsteelblue" : d.level; });

  transition.select("text")
    .attr("x", function(d) { return d.children || d.childrenHidden ? -20 : 20; }) // had 13 rather than 20
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d.childrenHidden ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1);
}

export default treeVisualization;
