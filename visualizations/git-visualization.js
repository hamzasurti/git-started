/* eslint-disable no-console */
import jQuery from './dependencies/jquery-1.10.2.js';
// Define d3, DAG, dagreD3

export default function (data) {
  console.log('Starting visualization function');

  // 'use strict';
  // Add a property called DAG to the global window object.
  // DAG will have two methods: displayGraph and renderGraph.
  window.DAG = {
      displayGraph: function (graph, dagNameElem, svgElem) {
          // Update the text inside the #dag-name span to reflect the name of the graph.
          dagNameElem.text(graph.name);
          // Run the function below.
          this.renderGraph(graph, svgElem);
      },

      renderGraph: function(graph, svgParent) {
          // Grab the nodes and links from the graph we want to display.
          var nodes = graph.nodes;
          var links = graph.links;

          // Using jQuery methods, grab the <g> element where we want to display the graph.
          var graphElem = svgParent.children('g').get(0);

          // Create a D3 selection with this element.
          var svg = d3.select(graphElem);

          // MOST CONFUSING STUFF BEGINS
          // Create a new instance of dagreD3's renderer constructor.
          // (dagreD3 is a global object defined in app/scripts/vendor/dagre-d3.js)
          var renderer = new dagreD3.Renderer();

          // dagreD3 is the global.dagreD3 object from dagre-d3.js
          // I think dagreD3.layout is dagre's layout method, which I assume is this: https://github.com/cpettitt/dagre/blob/master/lib/layout.js.
          var layout = dagreD3.layout().rankDir('LR');
          // ?rankDir can be 'LR' or something else. rankDir is used in switches a lot.

          // Run the layout method from our renderer instance.
          renderer.layout(layout) // It looks like this return another Renderer instance.
            // The run method is defined in dagre-d3.js on the Renderer prototype.
            // Below, I think we may be copying the layout and then appending it to a g.
            .run(dagreD3.json.decode(nodes, links), svg.append('g'));
          // MOST CONFUSING STUFF ENDS

          // Adjust SVG height to content
          var main = svgParent.find('g > g');
          var h = main.get(0).getBoundingClientRect().height;
          var newHeight = h + 40;
          newHeight = newHeight < 80 ? 80 : newHeight;
          svgParent.height(newHeight);

          // Zoom
          d3.select(svgParent.get(0)).call(d3.behavior.zoom().on('zoom', function() {
              var ev = d3.event;
              svg.select('g')
                  .attr('transform', 'translate(' + ev.translate + ') scale(' + ev.scale + ')');
          }));
      }
  };

  // load data on dom ready
  // Below 'jQuery' is the same as '$(document).ready' (https://api.jquery.com/ready/)
  // jQuery(function () {
        // load script with graph data
        // If the URL contains a query string, extract the name of the graph we should show.
        // If not, show graph1.
        // var fileName = window.location.search ? window.location.search.slice(1) : 'graph1.js';

        // Make a script tag that points to the graph we should show, and append it to the DOM.
        // var dataScript = document.createElement('script');
        // dataScript.src = fileName;
        // document.body.appendChild(dataScript);

        // Added by Isaac - I'm having trouble selecting by class for some reason.
        // function function1() {
        //   console.log('Entering a commit');
        // }
        // function function2() {
        //   console.log('Leaving a commit');
        // }
        // $(".label").hover(function1, function2);
    // });

    // callback for graph data loading
    // window.loadData = function (data) {
    //     DAG.displayGraph(data, jQuery('#dag-name'), jQuery('#dag > svg'));
    // };

    const loadData = function (data) {
        DAG.displayGraph(data, jQuery('#dag-name'), jQuery('#dag > svg'));
    };
    loadData(data);

    // window.updateCommitMessage = function (message) {
    //   $('#message').text(message);
    // }

  console.log('Finished visualization function');
}
