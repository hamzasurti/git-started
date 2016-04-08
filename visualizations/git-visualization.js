/* eslint-disable no-console */
// import jQuery from './dependencies/jquery-1.10.2.js';
// Refactoring opportunity: import d3 and dagreD3 here rather than loading them on index.html.

export default function (data) {
  console.log('Starting visualization function');

  function renderGraph(graph, svgParent) {
    // Grab the nodes and links from the graph we want to display.
    const nodes = graph.nodes;
    const links = graph.links;

    // Using jQuery methods, grab the <g> element where we want to display the graph.
    // const graphElem = svgParent.children('g').get(0);
    const graphElem = document.getElementById('git-g');
    // console.log('graphElem', graphElem);

    // Create a D3 selection with this element.
    const svg = d3.select(graphElem);

    // MOST CONFUSING STUFF BEGINS
    // Create a new instance of dagreD3's renderer constructor.
    // (dagreD3 is a global object defined in app/scripts/vendor/dagre-d3.js)
    const renderer = new dagreD3.Renderer();

    // dagreD3 is the global.dagreD3 object from dagre-d3.js
    // I think dagreD3.layout is dagre's layout method, which I assume is this: https://github.com/cpettitt/dagre/blob/master/lib/layout.js.
    const layout = dagreD3.layout().rankDir('LR');
    // ?rankDir can be 'LR' or something else. rankDir is used in switches a lot.

    // Run the layout method from our renderer instance.
    renderer.layout(layout) // It looks like this return another Renderer instance.
      // The run method is defined in dagre-d3.js on the Renderer prototype.
      // Below, I think we may be copying the layout and then appending it to a g.
      .run(dagreD3.json.decode(nodes, links), svg.append('g'));
    // MOST CONFUSING STUFF ENDS

    // Adjust SVG height to content
    // const main = svgParent.find('g > g');
    // console.log('main.get(0)', main.get(0));
    var $mine = document.querySelector('#git-g g');
    // console.log('$mine', $mine);
    // const h = main.get(0).getBoundingClientRect().height;
    const h = $mine.getBoundingClientRect().height;
    let newHeight = h + 40;
    newHeight = newHeight < 80 ? 80 : newHeight;
    const $svg = document.getElementById('git-svg');
    $svg.setAttribute('height', newHeight);
    // console.log('jQuery all gone?');
    // svgParent.height(newHeight); // Remove jQuery here***

    // Zoom
    // console.log('svgParent.get(0)', svgParent.get(0));
    d3.select($svg).call(d3.behavior.zoom().on('zoom', () => {
    // d3.select(svgParent.get(0)).call(d3.behavior.zoom().on('zoom', () => {
      const ev = d3.event;
      svg.select('g')
          .attr('transform', `translate(${ev.translate}) scale(${ev.scale})`);
    }));
  }

  // Is this the best place for this function?
  window.updateCommitMessage = function (message) {
    document.getElementById('#message').textContent = message;
    // jQuery('#message').text(message);
  };

  // console.log("document.getElementById('git-svg')", document.getElementById('git-svg'));
  // console.log("jQuery('#dag > svg')", jQuery('#dag > svg'));
  // renderGraph(data, document.getElementById('git-svg')); // want to get here
  // renderGraph(data, jQuery('#dag > svg')); // jQuery returns a jQuery object, not just the DOM el
  renderGraph(data);

  console.log('Finished visualization function');
}
