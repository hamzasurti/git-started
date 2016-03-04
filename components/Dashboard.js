import React, {Component} from 'react';
import {render} from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Terminal from './Terminal';

// Should I replace the occurrences of 'div' below with 'Dashboard'?
// We can add a column before the animation and terminal if we want a bigger left margin.
export default class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			lessonText: props.initialLessonText
		};
	}

  render() {
    return (
      <div id='Dashboard' className='row'>

        <div className='one-third column'>
        	One-third column
        	<Lesson lessonText={this.state.lessonText}/>
      	</div>

        <div className='two-thirds column'>
        	Two-thirds column
        	<Animation />
        	<Terminal />
        </div>

      </div>
    )
  }
}

Dashboard.defaultProps = {
	initialLessonText: 'Hey howdy hey'
};

render(<Dashboard />, document.getElementById('dashboard-container'));

// DELETE THIS WHEN I'M DONE
// Lesson
// <!-- 		<div class='one-third column' id='lesson'>Lesson</div>

// 				// <div class='two-thirds column'>

// Animation	
// 					<div id='animation'>Animation</div>
					
// Terminal
// 					<div id='terminal'>Terminal
// 						<div class="current"></div>
// 						<form>
// 							<input type="text" autocomplete="on" />
// 						</form>
// 						<script>
// 							require('./app.js');
// 						</script>
// 					</div>
				
// 				</div> -->

// Here's an ES5 version in case we need it later.

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

// // if (typeof window !== "undefined") { // For testing only
// 	ReactDOM.render(<Dashboard />, document.getElementById('dashboard-container'));
// // }