import React, {Component} from 'react';
import {render} from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Terminal from './Terminal';

// Import lesson content
import lesson1 from './../lessons/git-on-your-computer';

// Should I replace the occurrences of 'div' below with 'Dashboard'?
// We can add a column before the animation and terminal if we want a bigger left margin.
export default class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			lesson: props.initialLesson,
			slideNumber: props.initialSlideNumber,
			lessonText: props.initialLesson[props.initialSlideNumber].lessonText,
			buttonFunction: props.initialLesson[props.initialSlideNumber].buttonFunction
		};
	}

  render() {
    return (
      <div id='Dashboard' className='row'>

        <div className='one-third column'>
        	One-third column
        	<Lesson lessonText={this.state.lessonText} buttonFunction={this.state.buttonFunction}/>
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

// Note: The value of a prop can be JSX, but the prop must be enclosed by matching HTML tags.
// Is ' the best option here? Or is &rsquo; better?

// Should the button be part of the lesson text or not? That could get repetitive...
// Maybe I want an object that holds all the lessonText/buttonText pairs?
// I'm having trouble with onClick={this.props.buttonFunction} - this is undefined.

Dashboard.defaultProps = {
	initialLesson: lesson1,
	initialSlideNumber: 0//,
	// initialLessonText: lesson1[0].lessonText
};

// had this.initialLesson[this.initialSlideNumber]

// Old code
	// 	<div>
	// 		<h2>Welcome!</h2>
	// 		<p>If you're learning to code, chances are you've heard about something called Git. Git can be intimidating for beginners - but it doesn't have to be!</p>
	// 		<p>In this lesson, you'll...</p>
	// 		<ul>
	// 			<li>Set up Git</li>
	// 			<li>Set up a project</li>
	// 			<li>Learn some basic Git commands that you can use to track your new project</li>
	// 		</ul>
	// 		<p>Don't worry - we'll walk you through each step. Ready to get started?</p>
	// 		<button className='button-primary' id='lesson-button' onClick={function() {console.log('You clicked me!');}}>I don't do anything!</button>
	// 	</div>,
	// buttonFunction: function() {
	// 	console.log('You clicked me!');
	// }

// ' Stopping the madness

render(<Dashboard />, document.getElementById('dashboard-container'));

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