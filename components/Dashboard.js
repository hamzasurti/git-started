// Start ES6 code

// import React, {Component} from 'react';
// import {render} from 'react-dom';

// // Import other components here

// export default class Dashboard extends Component {
//   render() {
//     return (
//       <div id='Dashboard'>
//         Dashboard
//       </div>
//     )
//   }
// }

// // Changing document to mainWindow didn't work.
// render(<Dashboard />, document.getElementById('dashboard-container'));

// End ES6 code

// Hmmm... I'm seeing 'App threw an error when running [ReferenceError: document is not defined]'.
// I tried adding babel-preset-stage-0, but that didn't fix the problem.

// I tried using ES5 (below) instead, but that didn't make a difference.

var React = require('react');
var ReactDOM = require('react-dom'); // I tried commenting this out based on what I saw at https://github.com/Agrosis/electron-react-tutorial/blob/master/javascripts/entry.js, but it didnt' work.

// Import other components here

// Should I replace the occurrences of 'div' below with 'Dashboard'?
var Dashboard = React.createClass({
  render: function () {
    return (
      <div id='Dashboard'>
        Dashboard
      </div>
    )
  }
});

module.exports = Dashboard;

// React.render(<Dashboard />, document.getElementById('dashboard-container'));
ReactDOM.render(<Dashboard />, document.getElementById('dashboard-container'));