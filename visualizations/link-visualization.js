var d3 = require('d3'); // const?

var linkVisualization = {};

// Create a diagonal generator, a type of path data generator.
linkVisualization.diagonal = d3.svg.diagonal()
// Isaac: I don't completely understand the projection yet.
  .projection(function(d) { return [d.y, d.x]; });

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

export default linkVisualization;
