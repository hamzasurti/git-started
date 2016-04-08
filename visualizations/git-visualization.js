/* eslint-disable no-console */
// Refactoring opportunity: import d3 and dagreD3 here rather than loading them on index.html.

export default function (data) {
  console.log('Starting jQuery-free visualization function');

  function renderGraph(graph) {
    // Grab the nodes and links from the graph we want to display.
    const nodes = graph.nodes;
    const links = graph.links;

    // Grab the <g> element where we want to display the graph.
    const graphElem = document.getElementById('git-g');

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
  }

  // Is this the best place for this function?
  window.updateCommitMessage = function (message) {
    document.getElementById('message').textContent = message;
  };

  renderGraph(data);

  console.log('Finished visualization function');
}
