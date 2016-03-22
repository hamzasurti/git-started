import React, {Component} from 'react';
import {render} from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Sidebar from './Sidebar';
import Terminal from './Terminal';

// Import lesson content
import {lesson1} from './../lessons/git-on-your-computer';

// As we create new lessons, we can add new objects to the lessons array.
var lessons = [
	{
		name: 'Git on your computer',
		content: lesson1
	}
];

// Should I replace the occurrences of 'div' below with 'Dashboard'?
export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// Does it matter whether we use null or undefined here?
			lessonNumber: undefined,
			lessonContent: undefined,
			slideNumber: undefined,
			totalNumberOfSlides: undefined,
			lessonText: undefined,
			buttonText: undefined,
			errorMessage: undefined,
			sidebarVisible: props.initialSidebarVisible,
			lessonVisible: props.initialLessonVisible
		};
	}

	// Helper function that advances to the next slide
	advance() {
		// What to do if we're already on the last slide.
		if (this.state.slideNumber === this.state.totalNumberOfSlides - 1) {
			this.setState({
				slideNumber: 0,
				lessonText: this.state.lessonContent[0].lessonText,
				buttonText: this.state.lessonContent[0].buttonText,
				errorMessage: '',
			});

		// What to do on every other slide
		} else {
			this.setState({
	  		slideNumber: this.state.slideNumber + 1,
	  		// Would it be better to make the value of lessonText the result of a function?
	  		lessonText: this.state.lessonContent[this.state.slideNumber + 1].lessonText, // Again, I'd like to set the lesson dynamically down the line.
	  		buttonText: this.state.lessonContent[this.state.slideNumber + 1].buttonText,
				errorMessage: ''
	  	});
		}
	}

	handleClick() {
		// If this slide has a buttonFunction, run it.
		if(this.state.lessonContent[this.state.slideNumber].buttonFunction) {
			this.state.lessonContent[this.state.slideNumber].buttonFunction();
			// Listen for the result of the test triggered by buttonFunction (since I can't get the buttonFunction to return a Boolean, which would be simpler). I changed .on to .once
			ipcRenderer.once('test-result-2', function(event, arg) { // Refactoring opportunity: pull out and name this function.
				console.log(`Test result for slide ${this.state.slideNumber}: ${arg}`);
				// If the user passed the test (if arg is true), advance.
				if (arg) {
					this.advance();
				} else {
					this.showError();
				}
			}.bind(this));

		// If not, advance.
		} else {
			this.advance();
		}
  }

	showError() {
		this.setState({
			errorMessage: this.state.lessonContent[this.state.slideNumber].errorMessage
		});
	}

	toggleSidebar() {
		this.setState({
			sidebarVisible: !this.state.sidebarVisible
		});
	}

	hideLesson() {
		this.setState({
			lessonVisible: false
		})
	}

	showLesson(index) {
		this.setState({
			lessonNumber: index,
			lessonContent: lessons[index].content,
			slideNumber: 0,
			totalNumberOfSlides: lessons[index].content.length,
			lessonText: lessons[index].content[0].lessonText,
			buttonText: lessons[index].content[0].buttonText,
			errorMessage: '',
			lessonVisible: true
		})
	}

  // Isaac: I'm not sure whether the button and the handleClick function should live on Dashboard or on Lesson.
  render() {
		var dashboardStyle = {
			width: '95%',
			float: 'left'
		};
		var sidebarContainerStyle, sidebarStyle, sidebarButtonStyle, mainStyle, leftStyle, terminalStyle;

		if (this.state.sidebarVisible) {
			sidebarContainerStyle = {
				width: '17.5%',
				marginRight: '2.5%',
				float: 'left'
			};
			mainStyle = {
				width: '80%',
				float: 'left'
			};
			sidebarStyle = {
				display: 'block'
			}
		} else {
			sidebarContainerStyle = {
				width: '7.5%',
				marginRight: '2.5%',
				float: 'left'
			};
			mainStyle = {
				width: '90%',
				float: 'left'
			};
			sidebarStyle = {
				display: 'none'
			}
		}

		if (this.state.lessonVisible) {
			sidebarButtonStyle = {
				display: 'inline'
			};
			leftStyle = {
				width: '22%',
				marginRight: '2%',
				float: 'left'
			};
			terminalStyle = {
				width: '75%',
				float: 'left'
			}
		} else {
			sidebarButtonStyle = {
				display: 'none'
			};
			leftStyle = {
				display: 'none'
			};
			terminalStyle = {
				width: '100%',
				float: 'left'
			}
		}

		// Create an array of lesson names to pass down as props. (We don't want to pass all the lesson contents - that's a lot of data.)
		var lessonNames = lessons.map(lesson => lesson.name);

		// The image is from https://www.iconfinder.com/icons/134216/hamburger_lines_menu_icon#size=32
    return (
      <div id='Dashboard' style={dashboardStyle}>
				<div id='sidebar-container' style={sidebarContainerStyle}>
					<div className='add-padding'>
						<img src='assets/setting-icon.png' onClick={this.toggleSidebar.bind(this)}/>
						<Sidebar style={sidebarStyle} buttonStyle={sidebarButtonStyle} hideLesson={this.hideLesson.bind(this)} showLesson={this.showLesson.bind(this)} lessonNames={lessonNames} lessonNumber={this.state.lessonNumber} lessonVisible={this.state.lessonVisible} />
					</div>
				</div>
				<div id='main' style={mainStyle}>
					<div>
						<Animation />
						<div>
			        <div id='left' style={leftStyle}>
								<div className='add-padding'>
				        	<Lesson	totalNumberOfSlides={this.state.totalNumberOfSlides} slideNumber={this.state.slideNumber} lessonText={this.state.lessonText}
									hideLesson={this.hideLesson.bind(this)} />
				        	<button onClick={this.handleClick.bind(this)}>{this.state.buttonText}</button>
									<p><strong>{this.state.errorMessage}</strong></p>
								</div>
							</div>
							<Terminal style={terminalStyle} />
		      	</div>
					</div>
	      </div>
			</div>
    )
  }
}

Dashboard.defaultProps = {
	initialSidebarVisible: true,
	initialLessonVisible: false
};

render(<Dashboard />, document.getElementById('dashboard-container'));
