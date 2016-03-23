import React, {Component} from 'react';
import treeData from './../AnimationData/treeStructure';
import Tree from './Tree'; // Tree is a new component used by IsaacsHalfwayFinishedComponent.
var d3 = require('d3');
var ReactDOM = require('react-dom');
var _ = require('lodash');

// Notes from Isaac
// I've included two classes here: StructureAnimation (which is what we're currently using) and IsaacsHalfwayFinishedComponent (which we're not currently using).

// StructureAnimation is based on this blog post:
// http://javascript.tutorialhorizon.com/2014/09/08/render-a-d3js-tree-as-a-react-component/.
// The problem here is that D3 is creating DOM elements without React's knowledge.

// My goal in creating IsaacsHalfwayFinishedComponent was to make React responsible for DOM structure (adding and removing elements) and to make D3 responsible for styling, as described in this blog post:
// https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3#.ztcxqykek
// I didn't get all the way there, but I think I'm on the right track.

// To toggle between using StructureAnimation and using IsaacsHalfwayFinishedComponent, simply move the 'export default'.

export default class IsaacsHalfwayFinishedComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: props.initialTreeData,
      margin: props.initialMargin,
      height: 200 - props.initialMargin.top - props.initialMargin.bottom,
      width: 660 - props.initialMargin.right - props.initialMargin.left
    }
  }

  // Should we size the svg and main g here or earlier? This function is called after all the Tree.componentDidMounts.
  componentDidMount() {
    // Can we use selection.select for these?
    // Update our svg's width and height.
    var svg = ReactDOM.findDOMNode(this.refs.ourSVG);
    // Do we need the d3.select? Or can we just call .attr on svg?
    d3.select(svg)
      .attr("width", this.state.width + this.state.margin.right + this.state.margin.left)
      .attr("height", this.state.height + this.state.margin.top + this.state.margin.bottom);

    // Update our main g
    var g = ReactDOM.findDOMNode(this.refs.ourMainG);
    // Again, do we need the d3.select?
    d3.select(g)
      .attr("transform", "translate(" + this.state.margin.left + "," + this.state.margin.top + ")");

    // We should avoid using findDOMNode if possible (https://facebook.github.io/react/docs/top-level-api.html), but it may be inevitable here.
  }

  render() {
    // How do we set treeData[0].x0 and treeData[0].y0? I believe this needs to happen before render (I shouldn't modify state in render.)
    // Right now, I'm manually setting these properties on treeStructure.js. In the future, I'll need to account for subsequent renders.
    // treeData[0].x0: this.height / 2,
    // treeData[0].y0: 0,

    var duration = 450;

    // Create a tree layout of the specified size
    // (Does this mean we're creating a new tree on each render? I think it's OK to run these D3 functions since they're aren't creating or removing DOM elements.)
    // (Should we declare tree here or in this.state?)
    var tree = d3.layout.tree()
      .size([this.state.height, this.state.width]);

    // Create diagonal?
    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    // Create an array of nodes. We will pass one node to each Tree as props.
    var nodes = tree.nodes(this.state.treeData[0]).reverse(),
      linkSelection = tree.links(nodes);

    var root = nodes[nodes.length - 1];
    var rootX0 = root.x;
    var rootY0 = root.y;

    nodes.forEach(function(d, i) {
      d.y = d.depth * 180;
      d.id = i + 1;
      // I don't think the next two lines are quite right; they will need to change eventually.
      d.x0 = d.x;
      d.y0 = d.y;
      // I added the following two properties.
      d.rootX0 = rootX0;
      d.rootY0 = rootY0;
    });

    var links = linkSelection && linkSelection.map((link) => {
      return (<Link key={link.target.id} data={link} diagonal={diagonal} duration={duration} />)
    });
    console.log('links:', links);

    var trees = nodes && nodes.map((node) => {
      return (<Tree key={node.id} data={node} duration={duration} />)
    });

    return(
      <div id='Animation'>
        <svg ref='ourSVG'>
          <g ref='ourMainG'>
            {links}
            {trees}
          </g>
        </svg>
      </div>
    )
  }
}

IsaacsHalfwayFinishedComponent.defaultProps = {
  initialTreeData: treeData,
  initialMargin: {top: 0, right: 20, bottom: 0, left: 90}
}

class StructureAnimation extends Component {

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
    this.lastState = this.state
    this.setState({
      treeData: newSchema
    })
  }

  render() {
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
