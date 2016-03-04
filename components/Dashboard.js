// Start ES6 code

import React, {Component} from 'react';
import {render} from 'react-dom';

// Import other components here

export default class Dashboard extends Component {
  render() {
    return (
      <div id='Dashboard'>
        Dashboard
      </div>
    )
  }
}

render(<Dashboard />, document.getElementById('dashboard-container'));

// End ES6 code

// Hmmm... I'm seeing 'App threw an error when running [ReferenceError: document is not defined]'.

// I tried using ES5 (below) instead, but that didn't make a difference.

// var React = require('react');
// var ReactDOM = require('react-dom');

// // Import other components here

// var Dashboard = React.createClass({
//   render: function () {
//     return (
//       <div id='Dashboard'>
//         Dashboard
//       </div>
//     )
//   }
// });

// module.exports = Dashboard;

// ReactDOM.render(<Dashboard />, document.getElementById('dashboard-container'));