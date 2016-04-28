/* eslint-disable no-undef */
// We don't need to define ipcRenderer because it will be loaded by the time this file runs.
/* eslint-disable no-param-reassign */

import React, { Component } from 'react';
import d3 from 'd3';
import Tree from './Tree';
import Link from './Link';

// Import default file structure data
import treeData from './../AnimationData/treeStructure';

// In this component, React is responsible for DOM structure (adding and removing elements)
// and D3 is responsible for styling.
// This blog post provided inspiration:
// https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3#.ztcxqykek

export default class StructureAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: props.initialTreeData,
      margin: props.initialMargin,
      windowWidth: props.initialWindowWidth,
      windowHeight: props.initialWindowHeight,
    };
  }

  componentDidMount() {
    // This fires on initial load and when the user toggles between the structure and Git views.
    ipcRenderer.send('ready-for-schema', '\n');
    ipcRenderer.on('direc-schema', (e, arg) => {
      this.updateTree(arg);
    });
  }

  updateTree(newSchema) {
    this.setState({
      treeData: newSchema,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  }

  buildStyles(windowWidth, windowHeight, margin) {
    const styles = {};

    // Create variables to determine the size of the tree and the SVG containing it.
    styles.viewBoxWidth = this.state.windowWidth * 7 / 12;
    styles.viewBoxHeight = this.state.windowHeight * 7 / 24;
    styles.viewBoxString = `0 0 ${styles.viewBoxWidth} ${styles.viewBoxHeight}`;
    styles.translationValue = `translate(${margin.left}, ${margin.top})`;

    return styles;
  }

  buildTree(viewBoxHeight, viewBoxWidth) {
    const layout = {};

    // Create a tree layout.
    // The first argument provided to size() is the maximum x-coordinate D3 will assign.
    // The second argument is the maximum y-coordinate.
    // We're switching width and height here because d3 by default makes trees that branch
    // vertically, and we want a tree that branches horizontally.
    // In other words, nodes that are on the same level will have the same y-coordinate
    // but different x-coordinates.
    const tree = d3.layout.tree()
      .size([viewBoxHeight * 0.93, viewBoxWidth * 0.90]);

    // The first node in the array is the root of the tree.
    // Set its initial coordinates - where it should enter.
    const root = this.state.treeData[0];
    root.x0 = viewBoxHeight / 2;
    root.y0 = 0;

    // Create an array of nodes associated with the root.
    // (The returned array is basically a flattened version of treeData.)
    // Before the next line runs, each node has children, level, name, and value properties.
    // After the next line runs, each node also has parent, depth, x, and y properties.
    // (D3 tree nodes always have parent, child, depth, x, and y properties.)
    // We will pass one node from this array to each Tree as props.data.
    layout.nodes = tree.nodes(root);

    // Create an array of objects representing all parent-child links
    // in the nodes array we just created.
    layout.linkSelection = tree.links(layout.nodes);

    layout.nodes.forEach(d => {
      // The default y-coordinates provided by d3.tree will make the tree stretch
      // all the way across the screen.
      // We want to compress the tree a bit so that there's room for file/directory names
      // to the right of the deepest level.
      d.y *= 0.8;

      // If the node has a parent, set its initial coordinates to the parent's initial coordinates.
      // In other words, the parent and child should enter from the same place.
      if (d.parent) {
        d.x0 = d.parent.x0;
        d.y0 = d.parent.y0;
      }
    });

    return layout;
  }

  render() {
    const styles = this.buildStyles(this.state.windowWidth, this.state.windowHeight,
      this.state.margin);

    const layout = this.buildTree(styles.viewBoxHeight, styles.viewBoxWidth);

    // Create a counter variable that we'll use to stagger the items in our animation.
    let counter = 1;

    const trees = layout.nodes && layout.nodes.map((node) => {
      // Save the starting value of node.y as node.yOriginal so we can use it in the future.
      if (node.yOriginal === undefined) node.yOriginal = node.y;

      // Give the node an index property to determine how it will be staggered.
      node.index = counter ++;

      // If node.index is odd, adjust node.y, which determines the position of this tree and the
      // link to it.
      if (node.index % 2 === 1) node.y = node.yOriginal * 0.9;

      // Parse node.name to extract a unique key for this tree.
      node.name = node.name.trim();
      const nameEndsWithSlash = node.name.indexOf('/') === node.name.length - 1;
      const key = nameEndsWithSlash ? node.name.slice(0, node.name.length - 1) : node.name;
      return (<Tree key={key} data={node} />);
    });

    const links = layout.linkSelection && layout.linkSelection.map((link) => {
      link.target.name = link.target.name.trim();
      const nameEndsWithSlash = link.target.name.indexOf('/') === link.target.name.length - 1;
      const key = nameEndsWithSlash ? link.target.name.slice(0, link.target.name.length - 1) :
        link.target.name;
      return (<Link key={key} data={link} />);
    });

    return (
      <div width="100%" height="100%" id="Structure-Animation">
        <svg viewBox={styles.viewBoxString}>
          <g transform={styles.translationValue}>
            {links}
            {trees}
          </g>
        </svg>
      </div>
    );
  }
}

StructureAnimation.defaultProps = {
  initialTreeData: treeData,
  initialMargin: { top: 0, left: 20 },
  // The initial window dimensions are specified in app.on('ready') in main.js.
  initialWindowWidth: 1200,
  initialWindowHeight: 700,
};

StructureAnimation.propTypes = {
  initialTreeData: React.PropTypes.array,
  initialMargin: React.PropTypes.object,
  initialWindowWidth: React.PropTypes.number,
  initialWindowHeight: React.PropTypes.number,
};
