import React, {Component} from 'react';
import treeData from './../AnimationData/treeStructure';

// Tree and Link are two new components used by HalfwayFinishedStructureAnimation.
import Tree from './Tree';
import Link from './Link';

var d3 = require('d3');
var ReactDOM = require('react-dom');

// My goal in creating HalfwayFinishedStructureAnimation was to make React responsible for DOM structure (adding and removing elements) and to make D3 responsible for styling, as described in this blog post:
// https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3#.ztcxqykek

// We still need to handle window resizes. Here are some useful resources:
// http://eyeseast.github.io/visible-data/2013/08/28/responsive-charts-with-d3/
// http://bl.ocks.org/mbostock/3019563

export default class HalfwayFinishedStructureAnimation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: props.initialTreeData,
      margin: props.initialMargin,
      windowWidth: props.initialWindowWidth,
      windowHeight: props.initialWindowHeight
    }
  }

  // This function is called after all the Tree and Link componentDidMount functions have been called.
  componentDidMount() {
    ipcRenderer.on('direc-schema', (e,arg)=>{
      this.updateTreeData(arg);
    })

    // Reset the tree height and width if needed?
    // Would it be better to use a ref rather than an id?
  }

  updateTreeData(newSchema) {
    this.setState({
      treeData: newSchema
    });
  }

  render() {
    var duration = 450; // We may want to make this a prop.

    // Create variables to determine the size of the tree and the size of the SVG containing it (or just the height-width ratio?).
    var viewBoxHeight; // previously hard-coded as 300, which looks good if the sidebar and Chrome dev tools are visible
    // REFACTOR WITH TERNARY
    var viewBoxWidth = this.state.windowWidth * 7 / 12; // previously hard-coded as 660,
    if (this.props.sidebarVisible) {
      viewBoxHeight = this.state.windowHeight * 7 / 24;
    } else {
      viewBoxHeight = this.state.windowHeight * 5 / 24; // started with 7 / 24
    }

    // Create a tree layout.
    var tree = d3.layout.tree()
    // The first argument below is the maximum x-coordinate D3 will assign.
    // The second argument is the maximum y-coordinate.
    // We're switching width and height here because d3 by default makes trees that branch vertically, and we want a tree that branches horizontally.
    // In other words, nodes that are on the same level will have the same y-coordinate but different x-coordinates.
      .size([viewBoxHeight * 0.9, viewBoxWidth  * 0.9]);

    // Create a diagonal generator, a type of path data generator.
    var diagonal = d3.svg.diagonal()
    // Isaac: I don't completely understand the projection yet.
      .projection(function(d) { return [d.y, d.x]; });

    // We know that the first node in the array is the root of the tree. Let's designate its initial coordinates - where it should enter.
    var root = this.state.treeData[0];
    root.x0 = viewBoxHeight / 2;
    root.y0 = 0;

    // The next line creates and returns an array of nodes associated with the specified root node. (The returned array is basically a flattened version of treeData.)
    // D3 tree nodes always have parent, child, depth, x, and y properties.
    // Before the next line runs, each node has children, level, name, and value properties.
    // After the next line runs, each node also has parent, depth, x, and y properties.
    // We will pass one node from this array to each Tree as props.data.
    // ***Do we want to end the next line with reverse to put the root node at the end?
    var nodes = tree.nodes(root),
      // This line creates and returns an array of objects representing all parent-child links in the nodes array we just created.
      linkSelection = tree.links(nodes);

    nodes.forEach(function(d) {
      // The default y-coordinates provided by d3.tree will make the tree stretch all the way across the screen.
      // We want to compress the tree a bit so that there's room for file/directory names to the right of the deepest level.
      d.y *= .8;

      // We could scale d.x too to prevent the svg from cutting off notes at the top and bottom of a node column.

      // If the node has a parent, set the node's initial coordinates to the parent's initial coordinates.
      // *** Does this make sense?
      if (d.parent) {
        d.x0 = d.parent.x0;
        d.y0 = d.parent.y0;
      }
    });

    // I think it makes sense to the use target.name as an id, because no two links should ever point to the same target.
    // If needed, though, we could use {link.source.name + '/'  link.target.name} instead.
    var links = linkSelection && linkSelection.map((link) => {
      var nameEndsWithSlash = link.target.name.indexOf('/') === link.target.name.length - 1;
      var key = nameEndsWithSlash ? link.target.name.slice(0, link.target.name.length - 1) : link.target.name;
      return (<Link key={link.target.name} data={link} diagonal={diagonal} duration={duration} />)
    });

    var trees = nodes && nodes.map((node) => {
      var nameEndsWithSlash = node.name.indexOf('/') === node.name.length - 1;
      var key = nameEndsWithSlash ? node.name.slice(0, node.name.length - 1) : node.name;
      return (<Tree key={key} data={node} duration={duration} />);
    });

    var viewBoxString = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

    var translationValue = `translate(${this.state.margin.left}, ${this.state.margin.top})`;

    // If you want to see the size of the SVG, add this code before the links and trees:
    // <rect x='0' y='0' width={viewBoxWidth - this.state.margin.left} height={viewBoxHeight - this.state.margin.top} rx='15' ry='15' />
    // How does the svg know to fill the full width of its containing div?
    return(
      <div id='Structure-Animation'>
        <svg viewBox={viewBoxString}>
          <g transform={translationValue}>
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
  // We're not currently using the right or bottom margins.
  initialMargin: {top: 8, right: 20, bottom: 0, left: 90},
  // The initial window dimensions are specified in app.on('ready') in main.js.
  initialWindowWidth: 1200,
  initialWindowHeight: 700
}
