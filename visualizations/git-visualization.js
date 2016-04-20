/* eslint-disable no-undef */
// We don't need to define dagreD3 because it will be loaded by the time this file runs.
/* eslint-disable no-param-reassign */

import d3 from 'd3';
import DAG from '../AnimationData/DAG';

const gitVisualization = {};

gitVisualization.renderGraph = (graph) => {
  // Grab the nodes and links we want to display.
  const nodes = graph.nodes;
  const links = graph.links;

  // Grab the <g> element where we want to display the graph.
  const graphElem = document.getElementById('git-g');

  // Clear anything currently displayed in this element.
  d3.select(graphElem).selectAll('*').remove();

  // Create a D3 selection with this element.
  const svg = d3.select(graphElem);

  // Create a new instance of dagreD3's renderer constructor.
  // dagreD3 is the global.dagreD3 object from dagre-d3.js.
  const renderer = new dagreD3.Renderer();

  // Append our graph to the page.
  const layout = dagreD3.layout().rankDir('LR');
  renderer.layout(layout)
    .run(dagreD3.json.decode(nodes, links), svg.append('g'));

  // Adjust the height our SVG to fit the content.
  const h = document.querySelector('#git-g g').getBoundingClientRect().height;
  let newHeight = h + 40;
  newHeight = newHeight < 80 ? 80 : newHeight;
  const $svg = document.getElementById('git-svg');
  $svg.setAttribute('height', newHeight);

  // Add zoom functionality.
  d3.select($svg).call(d3.behavior.zoom().on('zoom', () => {
    const ev = d3.event;
    svg.select('g')
        .attr('transform', `translate(${ev.translate}) scale(${ev.scale})`);
  }));
};

gitVisualization.createGraph = (nestedCommitArr) => {
  const gitGraph = new DAG();
  for (let i = 0; i < nestedCommitArr.length - 1; i++) {
    if (nestedCommitArr[i][1].match(/\s/)) {
      nestedCommitArr[i][1] = nestedCommitArr[i][1].split(/\s/);
    }
    gitGraph.addEdges(nestedCommitArr[i][0], nestedCommitArr[i][2], null, nestedCommitArr[i][1]);
  }

  const result = {};
  const nodes = [];
  const links = [];
  const names = gitGraph.names;
  const vertices = gitGraph.vertices;
  let linkNum = 1;

  // For each commit in the names array...
  for (let i = 0; i < names.length; i++) {
    // Create a node and push it to the nodes array.
    const node = {};
    const hash = names[i];
    node.id = hash;
    node.value = {};
    node.value.label = hash;
    node.value.message = vertices[hash].value || 'No commit message available';
    nodes.push(node);

    // Create a link for each of the commit's parents and push it to the links array.
    const parents = vertices[hash].incomingNames;
    for (let j = 0; j < parents.length; j ++) {
      const link = {};
      link.u = hash;
      link.v = parents[j];
      link.value = {};
      link.value.label = `link ${linkNum}`;
      links.push(link);
      linkNum ++;
    }
  }

  result.nodes = nodes;
  result.links = links;
  return result;
};

export default gitVisualization;
