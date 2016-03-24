import React, {Component} from 'react';
import treeData from './../AnimationData/treeStructure';

// Tree and Link are two new components used by HalfwayFinishedStructureAnimation.
import Tree from './Tree';
import Link from './Link';

var d3 = require('d3');
var ReactDOM = require('react-dom');
var _ = require('lodash');

// My goal in creating HalfwayFinishedStructureAnimation was to make React responsible for DOM structure (adding and removing elements) and to make D3 responsible for styling, as described in this blog post:
// https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3#.ztcxqykek
// I didn't get all the way there, but I think I'm on the right track.

export default class HalfwayFinishedStructureAnimation extends Component {

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
    ipcRenderer.on('direc-schema', (e,arg)=>{
      this.updateTreeData(arg);
    })

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

  updateTreeData(newSchema) {
    // console.log('updating tree with', newSchema);
      this.setState({
        treeData: newSchema
      })
  }

  render() {
    console.log('rendering. Most recent change: now updated nodes should actually move correctly');
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

    // Create diagonal for links?
    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    // Create an array of nodes. We will pass one node to each Tree as props.
    // removed .reverse() from end of next line
    var nodes = tree.nodes(this.state.treeData[0]),
      linkSelection = tree.links(nodes);

    var root = nodes[nodes.length - 1];
    var rootX0 = root.x;
    var rootY0 = root.y;

    nodes.forEach(function(d, i) {
      d.y = d.depth * 180;
      // d.id = i + 1; // I'm trying to use d.name rather than d.id. If I use i + 1, I'm assigning an id (which will later become a React key) based just on the node's position in the array. node.name isn't perfect (there could be duplicates), but it's better.
      // I don't think the next two lines are quite right; they will need to change eventually.
      d.x0 = d.x;
      d.y0 = d.y;
      // I added the following two properties.
      d.rootX0 = rootX0;
      d.rootY0 = rootY0;
    });

    var links; // removing links for testing
    // var links = linkSelection && linkSelection.map((link) => {
    //   return (<Link key={link.target.name} data={link} diagonal={diagonal} duration={duration} />)
    // });

    var trees = nodes && nodes.map((node) => {
      return (<Tree key={node.name} data={node} duration={duration} />);
    });

    return(
      <div id='Structure-Animation'>
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

HalfwayFinishedStructureAnimation.defaultProps = {
  initialTreeData: [{}], // treeData, // To start with an empty tree: [{}]
  initialMargin: {top: 0, right: 20, bottom: 0, left: 90}
}
