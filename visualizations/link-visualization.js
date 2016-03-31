const d3 = require('d3'); // const?

var linkVisualization = {};

// Create a diagonal generator, a type of path data generator.
linkVisualization.diagonal = d3.svg.diagonal()
// Isaac: I don't completely understand the projection yet.
  .projection(function(d) { return [d.y, d.x]; })

// Note from Isaac: I'm not sure if this is the best place to store our duration, but every file that needs that variable has access to this file.
linkVisualization.duration = 450;

// Set the attributes for links that are new to the DOM
linkVisualization.enter = (selection, diagonal, duration) => {
  selection.style("stroke", function(d){return d.target.level ? d.target.level : "#ccc"})
           .attr("d", function(d) {
                        var o = {x: d.target.x0, y: d.target.y0};
                        return diagonal({source: o, target: o})})


  linkVisualization.update(selection, diagonal, duration)
}

// Transition new and updated links to their new position
linkVisualization.update = (selection, diagonal, duration) => {
  selection.style("stroke", function(d){return d.target.level ? d.target.level : "#ccc"})
    .transition()
    .duration(duration)
    .attr("d", diagonal)
}

// Hide links when we're hiding the children they point to.
linkVisualization.exit = (selection, diagonal, duration) => {
  selection.style("stroke", function(d){return d.target.level ? d.target.level : "#ccc"})

    .transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: d.source.x, y: d.source.y};
      return diagonal({source: o, target: o});
    })
}

export default linkVisualization;
