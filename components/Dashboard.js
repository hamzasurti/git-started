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
			slideNumber: props.initialSlideNumber,
			lessonText: lesson1[props.initialSlideNumber].lessonText, // Down the line (not in the MVP), it would be nice to be able to set the lesson (rather than having 'lesson1' hard-coded in). Could I have a 'lesson number' prop?
			buttonText: lesson1[props.initialSlideNumber].buttonText
		};
	}

	// I'll eventually need to add logic to see whether the user passed the test. The test will depend on this.state.slideNumber. I could potentially pull the tests and buttonText from lesson1.
	handleClick() {
		// console.log('handleClick is running. this.state.slideNumber is', this.state.slideNumber); // For testing only
		// console.log('this is', this); // this is Dashboard

		// What to do if we're already on the last slide.
		if (this.state.slideNumber === lesson1.length - 1) {
			this.setState({
				slideNumber: 0,
				lessonText: lesson1[0].lessonText,
				buttonText: lesson1[0].buttonText
			});

		} else {
			this.setState({
	  		slideNumber: this.state.slideNumber + 1,
	  		// Would it be better to make the value of lessonText the result of a function?
	  		lessonText: lesson1[this.state.slideNumber + 1].lessonText, // Again, I'd like to set the lesson dynamically down the line.
	  		buttonText: lesson1[this.state.slideNumber + 1].buttonText
	  	});
		}
  }

	// Down the line, we might want a function that runs when a user hits the Enter key in the terminal.

  // Isaac: I'm not sure whether the button and the handleClick function should live on Dashboard or on Lesson. But I believe this file is the only place we should use this.setState.
  render() {
    return (
      <div id='Dashboard' className='row'>

        <div className='one-third column' id='left'>
        	<Lesson slideNumber={this.state.slideNumber} lessonText={this.state.lessonText} />
        	<button className='button-primary' onClick={this.handleClick.bind(this)}>{this.state.buttonText}</button>
      	</div>

        <div className='two-thirds column'>
        	<Animation />
        	<Terminal />
        </div>

      </div>
    )
  }
}

// Note: The value of a prop can be JSX, but the prop must be enclosed by matching HTML tags.
// Is ' the best option here? Or is &rsquo; better?

Dashboard.defaultProps = {
	initialLesson: lesson1,
	initialSlideNumber: 0
};

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