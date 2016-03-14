const fs = require('fs');
// const $ = require('jquery');
const Terminal = require('term.js'); // terminal written in JS: https://github.com/chjj/term.js
const pty = require('pty.js'); // low-level terminal spawner: https://github.com/chjj/pty.js
const ipcRenderer = require('electron').ipcRenderer; // allows render process and main process to communicate: http://electron.atom.io/docs/v0.36.8/api/ipc-renderer
const elem = document.getElementById("Terminal");
console.log(elem);

const term = new Terminal({ // creates a new term.js terminal
  cursorBlink: true,
  useStyle: true,
  cols: 100,
  rows: 20
});

term.open(elem);
var ptyProcess = pty.fork('bash', [], {
  cwd: process.env.HOME,
  env: process.env,
  name: 'xterm-256color'
});


term.on("data", function(data) {
  console.log('term on data ++++>', data);
  ipcRenderer.send('command-message', data);
  console.log(ptyProcess);

});

ptyProcess.on('data', (data) => {
  console.log('ptyProcess data +++>',data);
  term.write(eval(`PS1=$("\h: \W $ ")`);
})

ipcRenderer.on('terminal-reply', (event, arg) => {
 term.write(arg);
 console.log('ipcReneder on terminal-reply +++>',arg);
});


var treeData = [
  {
    "name": "Top Level",
    "parent": "null",
    "value": 10,
    "type": "black",
    "level": "red",
    "children": [
      {
        "name": "Level 2: A",
        "parent": "Top Level",
        "value": 15,
        "type": "grey",
        "level": "red",
        "children": [
          {
            "name": "Son of A",
            "parent": "Level 2: A",
            "value": 5,
            "type": "steelblue",
            "level": "orange"
          },
          {
            "name": "Daughter of A",
            "parent": "Level 2: A",
            "value": 8,
            "type": "steelblue",
            "level": "red"
          }
        ]
      },
      {
        "name": "Level 2: B",
        "parent": "Top Level",
        "value": 10,
        "type": "grey",
        "level": "green"
      }
    ]
  }
];


// ************** Generate the tree diagram	 *****************
var margin = {top: 0, right: 20, bottom: 0, left: 90},
	width = 660 - margin.right - margin.left,
	height = 200 - margin.top - margin.bottom;

var i = 0,
	duration = 450,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#Animation").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;

update(root);


function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
}
