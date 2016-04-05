/* eslint-disable no-console */
import React, { Component } from 'react';
import { render } from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Sidebar from './Sidebar';
import Terminal from './Terminal';
<<<<<<< HEAD
// Import lesson content
import {lesson1} from './../lessons/git-on-your-computer';

// testing for react tour
var ReactTour = require('react-tour');
// import url(node_modules/react-tour/dist/style.css);
// delete if does not work

// As we create new lessons, we can add new objects to the lessons array.
var lessons = [
	{
		name: 'Git on your computer',
		content: lesson1,
		iconPath: 'assets/git-icon.png'
	}
];
=======
>>>>>>> e9bbcca9c35551eaf9b2da2877f3189074d9f542

import lessons from './../lessons/lesson-list';

export default class Dashboard extends Component {
<<<<<<< HEAD
	constructor(props) {
		super(props);
		this.state = {
			lessonNumber: undefined,
			lessonContent: undefined,
			slideNumber: undefined,
			totalNumberOfSlides: undefined,
			lessonText: undefined,
			buttonText: undefined,
			errorMessage: undefined,
			sidebarVisible: props.initialSidebarVisible,
			lessonVisible: props.initialLessonVisible,
			structureAnimationVisible: props.initialStructureAnimationVisible,
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
		} else {
			this.advance();
		}
=======
  constructor(props) {
    super(props);
    this.setErrorVisibility = this.setErrorVisibility.bind(this);
    this.setStructureAnimationVisibility = this.setStructureAnimationVisibility.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.showLesson = this.showLesson.bind(this);
    this.hideLesson = this.hideLesson.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.state = {
      lessonNumber: undefined,
      slideNumber: undefined,
      sidebarVisible: props.initialSidebarVisible,
      structureAnimationVisible: props.initialStructureAnimationVisible,
      lessonVisible: props.initialLessonVisible,
      errorVisible: props.initialErrorVisible,
    };
  }

  setErrorVisibility(boolean) {
    this.setState({
      errorVisible: boolean,
    });
  }

  setStructureAnimationVisibility(boolean) {
    this.setState({
      structureAnimationVisible: boolean,
    });
  }

  toggleSidebar() {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
    });
  }

  showLesson(index) {
    this.setState({
      lessonNumber: index,
      slideNumber: 0,
      lessonVisible: true,
    });
  }

  hideLesson() {
    this.setState({
      lessonVisible: false,
    });
  }

  changeSlide(number) {
    this.setState({
      slideNumber: number,
    });
  }

  buildStyles(sidebarVisible) {
    const styles = {};

    styles.dashboard = { height: '100%', width: '100%' };
    styles.sidebar = { height: '100%', backgroundColor: 'lightGray' };
    styles.settingsIcon = { padding: '8px' };
    styles.main = { height: '100%' };
    styles.upperHalf = { height: '50%', width: '100%' };
    styles.lowerHalf = { height: '50%', width: '100%' };

    if (sidebarVisible) {
      styles.sidebar.float = 'left';
      styles.sidebar.width = '20%';
      styles.main.float = 'left';
      styles.main.width = '80%';
    } else {
      styles.sidebar.position = 'absolute';
      styles.sidebar.width = '28px';
      styles.main.position = 'absolute';
      styles.main.left = '28px';
      styles.main.right = 0;
    }

    return styles;
>>>>>>> e9bbcca9c35551eaf9b2da2877f3189074d9f542
  }

  render() {
<<<<<<< HEAD
		// Put styling in a separate function that render can call.
		var sidebarStyle = {padding: '8px'};

		var sidebarContainerStyle = {height: '100%', backgroundColor: 'lightGray'};
		var mainStyle = {height: '100%'};
		var upperHalfStyle = {height: '50%', width: '100%'};
		var lowerHalfStyle = {height: '50%', width: '100%'};
		// Isaac: I'm not sure whether overflow should be auto or scroll.
		var leftStyle = {float: 'left', height: '100%', overflow: 'scroll'};
		var terminalStyle = {float: 'left', height: '100%', backgroundColor: 'black'};

		if (this.state.sidebarVisible) {
			sidebarContainerStyle.float = 'left';
			sidebarContainerStyle.width = '20%';
			mainStyle.float = 'left';
			mainStyle.width = '80%';
			sidebarStyle.display = 'block';
		} else {
			sidebarContainerStyle.position = 'absolute';
			sidebarContainerStyle.width = '28px'; // was 10%
			mainStyle.position = 'absolute';
			mainStyle.left = '28px';
			mainStyle.right = 0;
			sidebarStyle.display = 'none';
		}

		if (this.state.lessonVisible) {
			leftStyle.width = '35%';
			terminalStyle.width = '65%';
			leftStyle.maxWidth = '100px';

		} else {
			leftStyle.display = 'none';
			terminalStyle.width = '100%';
		}

		// Create an array of lesson names to pass down as props. (We don't want to pass all the lesson contents - that's a lot of data.)
		var lessonInfo = lessons.map(lesson => {
			return {
				name: lesson.name,
				iconPath: lesson.iconPath
			}
		});

		// The image is from https://www.iconfinder.com/icons/134216/hamburger_lines_menu_icon#size=32
=======
    const styles = this.buildStyles(this.state.sidebarVisible);

    // Create an array of lesson names to pass down to Sidebar as props.
    // (We don't want to pass all the lesson contents - that's a lot of data.)
    const lessonInfo = lessons.map(lesson =>
      ({
        name: lesson.name,
        iconPath: lesson.iconPath,
      })
    );

    const lesson = this.state.lessonVisible ?
      <Lesson lessonNumber={ this.state.lessonNumber } slideNumber={ this.state.slideNumber }
        styles={ styles } errorVisible={ this.state.errorVisible } changeSlide={ this.changeSlide }
        hideLesson={ this.hideLesson } setErrorVisibility={ this.setErrorVisibility }
      /> : undefined;

    // The image is from https://www.iconfinder.com/icons/134216/hamburger_lines_menu_icon#size=32
>>>>>>> e9bbcca9c35551eaf9b2da2877f3189074d9f542
    return (
      <div id="Dashboard" style={ styles.dashboard }>
        <div style={ styles.sidebar }>
          <img src="assets/setting-icon.png" onClick={ this.toggleSidebar }
            height="12px" width="12px" style={ styles.settingsIcon }
          />
          <Sidebar showLesson={ this.showLesson }
            lessonInfo={ lessonInfo } lessonNumber={ this.state.lessonNumber }
            lessonVisible={ this.state.lessonVisible } sidebarVisible={ this.state.sidebarVisible }
          />
        </div>
        <div style={ styles.main }>
          <div style={ styles.upperHalf }>
            <Animation structureAnimationVisible={ this.state.structureAnimationVisible }
              setStructureAnimationVisibility={ this.setStructureAnimationVisibility }
              sidebarVisible={ this.state.sidebarVisible }
            />
          </div>
          <div style={ styles.lowerHalf }>
            {lesson}
            <Terminal lessonVisible={ this.state.lessonVisible } />
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  initialSidebarVisible: React.PropTypes.bool,
  initialStructureAnimationVisible: React.PropTypes.bool,
  initialLessonVisible: React.PropTypes.bool,
  initialErrorVisible: React.PropTypes.bool,
};

Dashboard.defaultProps = {
  initialSidebarVisible: true,
  initialStructureAnimationVisible: true,
  initialLessonVisible: false,
  initialErrorVisible: false,
};

render(<Dashboard />, document.getElementById('dashboard-container'));
