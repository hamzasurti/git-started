import React, {Component} from 'react';
import treeData from './../AnimationData/treeStructure';

var d3 = require('d3');
var ReactDOM = require('react-dom');
var _ = require('lodash');

// StructureAnimation is based on this blog post:
// http://javascript.tutorialhorizon.com/2014/09/08/render-a-d3js-tree-as-a-react-component/.
// The problem here is that D3 is creating DOM elements without React's knowledge, using the renderTree component at the bottom of this page.

export default class StructureAnimation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: props.initialTreeData
    }
  }

  componentDidMount(){
    var mountNode = ReactDOM.findDOMNode(this.refs.treeRender);
    // Render the tree usng d3 after first component mount
    renderTree(this.state.treeData, mountNode);
  }

  shouldComponentUpdate(nextProps, nextState){
    if (_.isEqual(this.lastState,nextState)){
      return false
    } else {
      // Delegate rendering the tree to a d3 function on prop change
      renderTree(nextState.treeData, ReactDOM.findDOMNode(this.refs.treeRender));
      // Do not allow react to render the component on prop change
      return false;
    }
  }

  updateTree(newSchema){
    console.log('updating tree with', newSchema);
    this.lastState = this.state
    this.setState({
      treeData: newSchema
    })
  }

  render() {
    console.log('rendering StructureAnimation with', this.state.treeData);

    ipcRenderer.on('direc-schema', (e,arg)=>{
      this.updateTree(arg);
    })

    return (
      <div id='Structure-Animation'>
        <svg ref="treeRender"></svg>
      </div>
    )
  }
}

StructureAnimation.defaultProps = {
  initialTreeData: treeData
}

var renderTree = function(treeData, svgDomNode) {

  var margin = {top: 0, right: 90, bottom: 0, left: 180},
  	width = 660 - margin.right - margin.left,
  	height = 200 - margin.top - margin.bottom;

    var i = 0,
      duration = 450,
      root;

    // Cleans up the SVG on re-render
    d3.select(svgDomNode).selectAll("*").remove();

    var tree = d3.layout.tree()
      .size([height, width]);

    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select(svgDomNode)
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
        .style("fill", function(d) { return d._children ? "lightsteelblue" : d.level; });

      nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -20 : 20; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
        .attr("r", function(d) { return d.value ? d.value : 5; })
        .style("fill", function(d) { return d._children ? "lightsteelblue" : d.level;; });

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
}
