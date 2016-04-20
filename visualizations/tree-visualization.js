/* eslint-disable no-undef */
// We don't need to define ipcRenderer because it will be loaded by the time this file runs.
/* eslint-disable no-confusing-arrow */

import linkVisualization from './link-visualization';

const treeVisualization = {};

treeVisualization.duration = linkVisualization.duration;

// Set the attributes for nodes that are new to the DOM, including placing them in their initial
// position (x0, y0).
treeVisualization.enter = (selection, duration) => {
  // Translate this node d.y0 units right and d.x0 units down.
  selection.attr('transform', d => `translate(${d.y0},${d.x0})`);

  selection.select('image')
    .on('click', d => {
      if (d.type) {
        const commandString = `cd ${d.name.replace(/ /g, '\\ ')} \n\r`;
        ipcRenderer.send('command-message', commandString);
      }
      if (d.value || d.children) {
        const commandString = `cd .. \n\r`;
        ipcRenderer.send('command-message', commandString);
      }
    });

  treeVisualization.update(selection, duration);
};

// Transition new and updated nodes to their new positions.
treeVisualization.update = (selection, duration) => {
  const transition = selection.transition()
    .duration(duration)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  // Update the x, y, width, and height for proper scaling
  // y must always be half of the height
  const scale = 16;

  transition.select('image')
    .attr('xlink:href', d => d.icon)
    .attr('x', d => d.position_x ? d.position_x : 0)
    .attr('y', d => d.position_y ? d.position_y : scale * -(1 / 2))
    .attr('width', d => d.value ? d.value : scale)
    .attr('height', d => d.value ? d.value : scale);

  transition.select('text')
    .attr('x', d => d.value ? -9 : 17)
    .attr('y', d => {
      if (d.value) return 25;
      return undefined;
    })
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill-opacity', 1)
    .style('font-size', d => d.value ? 10 : 7)
    .text(d => d.name)
    .style('fill-opacity', 1)
    .style('fill', '#A09E9E');
};

export default treeVisualization;
