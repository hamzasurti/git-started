import React, {Component} from 'react';
import {render} from 'react-dom';

// Import other components here

// Should I replace the occurrences of 'div' below with 'Dashboard'?
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

// Here's an ES5 version in case we need it later.

var React = require('react');
var ReactDOM = require('react-dom'); 

// Import other components here

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

// if (typeof window !== "undefined") { // For testing only
	ReactDOM.render(<Dashboard />, document.getElementById('dashboard-container'));
// }