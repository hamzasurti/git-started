// Refactoring opportunity: import d3 and dagreD3 here rather than loading them on index.html.
const DAG = require('../AnimationData/DAG'); // Can we import instead?

const gitVisualization = {};

gitVisualization.renderGraph = function (graph) {
  // Is this the best place for this function, which is needed to show commit messages?
  // window.updateCommitMessage = function (message) {
  //   document.getElementById('message').textContent = message;
  // };

  // Grab the nodes and links from the graph we want to display.
  const nodes = graph.nodes;
  const links = graph.links;

  // Grab the <g> element where we want to display the graph.
  const graphElem = document.getElementById('git-g');
  // Clear anything currently displayed there. (***Or should this happen earlier?)
  d3.select(graphElem).selectAll('*').remove();
  // Create a D3 selection with this element.
  const svg = d3.select(graphElem);

  // Create a new instance of dagreD3's renderer constructor.
  // (dagreD3 is the global.dagreD3 object from dagre-d3.js)
  const renderer = new dagreD3.Renderer();

  // Note from Isaac: I think dagreD3.layout is dagre's layout method, which I assume is this: https://github.com/cpettitt/dagre/blob/master/lib/layout.js.
  const layout = dagreD3.layout().rankDir('LR');

  // Run the layout method from our renderer instance.
  // It seems to return another Renderer instance.
  renderer.layout(layout)
    // The run method is defined in dagre-d3.js on the Renderer prototype.
    // Below, I think we may be copying the layout and then appending it to a g.
    .run(dagreD3.json.decode(nodes, links), svg.append('g'));

  // Adjust SVG height to content
  const h = document.querySelector('#git-g g').getBoundingClientRect().height;
  let newHeight = h + 40;
  newHeight = newHeight < 80 ? 80 : newHeight;
  const $svg = document.getElementById('git-svg');
  $svg.setAttribute('height', newHeight);

  // Zoom
  d3.select($svg).call(d3.behavior.zoom().on('zoom', () => {
    const ev = d3.event;
    svg.select('g')
        .attr('transform', `translate(${ev.translate}) scale(${ev.scale})`);
  }));
};

gitVisualization.createGraph = function (nestedCommitArr) {
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
    // The line below seems not to like null values.
    node.value.label = hash;
    node.value.message = vertices[hash].value || 'No commit message available';
    nodes.push(node);

    // Create a link for each of the commit's parents and push it to the links array.
    const parents = vertices[hash].incomingNames;
    for (let j = 0; j < parents.length; j ++) {
      const link = {};
      link.u = hash; // child/source
      link.v = parents[j]; // parent/target
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
