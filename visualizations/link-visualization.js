import d3 from 'd3';

const linkVisualization = {};

// Create a diagonal generator, a type of path data generator.
linkVisualization.diagonal = d3.svg.diagonal()
  .projection((d) => [d.y, d.x]);

// Set a duration to use for all our transitions.
linkVisualization.duration = 450;

// Set the attributes for links that are new to the DOM.
linkVisualization.enter = (selection, diagonal, duration) => {
  selection.attr('d', d => {
    const o = { x: d.target.x0, y: d.target.y0 };
    return diagonal({ source: o, target: o });
  })
  .style('stroke', d => d.target.level)
  .style('stroke-width', 0.5);

  linkVisualization.update(selection, diagonal, duration);
};

// Transition new and updated links to their new position.
linkVisualization.update = (selection, diagonal, duration) => {
  selection.transition()
    .duration(duration)
    .attr('d', diagonal)
    .style('stroke', d => d.target.level)
    .style('stroke-width', 0.5);
};

export default linkVisualization;
