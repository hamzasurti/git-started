import React, {Component} from 'react';
import treeData from './../AnimationData/treeStructure';

// Tree and Link are two new components used by HalfwayFinishedStructureAnimation.
import Tree from './Tree';
import Link from './Link';

var d3 = require('d3');
var ReactDOM = require('react-dom');
var _ = require('lodash'); // Are we using this?

// My goal in creating HalfwayFinishedStructureAnimation was to make React responsible for DOM structure (adding and removing elements) and to make D3 responsible for styling, as described in this blog post:
// https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3#.ztcxqykek
// I didn't get all the way there, but I think I'm on the right track.

// We still need to handle window resizes. Here are some useful resources:
// http://eyeseast.github.io/visible-data/2013/08/28/responsive-charts-with-d3/
// http://bl.ocks.org/mbostock/3019563

export default class HalfwayFinishedStructureAnimation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: props.initialTreeData,
      margin: props.initialMargin,
      height: 200 - props.initialMargin.top - props.initialMargin.bottom,
      width: 660 - props.initialMargin.right - props.initialMargin.left,
      treeHeight: props.initialTreeHeight,
      treeWidth: props.initialTreeWidth
    }
  }

  // This function is called after all the Tree and Link componentDidMount functions have been called.
  componentDidMount() {
    ipcRenderer.on('direc-schema', (e,arg)=>{
      this.updateTreeData(arg);
    })

    // Reset the tree height and width if needed.
    // Would it be better to use a ref rather than an id?
    var upperHeight = document.getElementById('upper-half').offsetHeight;
  }

  updateTreeData(newSchema) {
      this.setState({
        treeData: newSchema
      });
  }

  render() {
    var duration = 450; // We may want to make this a prop.

    // Create a tree layout of the specified size (whenever this component renders)
    var tree = d3.layout.tree()
    // If we don't specify a size for the tree, it collapses.
      .size([this.state.treeHeight, this.state.treeWidth]);

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

    // I think it makes sense to the use target.name as an id, because no two links should ever point to the same target.
    // If needed, though, we could use {link.source.name + '/'  link.target.name} instead.
    var links = linkSelection && linkSelection.map((link) => {
      return (<Link key={link.target.name} data={link} diagonal={diagonal} duration={duration} />)
    });

    var trees = nodes && nodes.map((node) => {
      return (<Tree key={node.name} data={node} duration={duration} />);
    });

    console.log('Rendering. Latest update: translationValue');

    var translationValue = `translate(${this.state.margin.left}, ${this.state.margin.top})`;

    // Do I need to set SVG height below? Is that even possible? Or will the SVG resize to fit the inner g's inside it? (It doesn't look like it's expanding to fit the tree layout.)
    return(
      // Isaac: This StackOverflow response helped me size the svg:
      // http://stackoverflow.com/questions/8919076/how-to-make-a-svg-element-expand-or-contract-to-its-parent-container
      <div id='Structure-Animation'>
        <svg width='100%' height='100%' viewBox='0 0 660 200' preserveAspectRatio='none'>
          <g ref='ourMainG' transform={translationValue}>
            {links}
            {trees}
          </g>
        </svg>
      </div>
    )
  }
}

HalfwayFinishedStructureAnimation.defaultProps = {
  initialTreeData: treeData, // To start with an empty tree: [{}]
  initialMargin: {top: 0, right: 20, bottom: 0, left: 90},
  initialTreeHeight: 200,
  initialTreeWidth: 550
}
