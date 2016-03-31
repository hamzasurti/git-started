import React, { Component } from 'react';
import { render } from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Sidebar from './Sidebar';
import Terminal from './Terminal';

// Import lesson content
import { lesson1 } from './../lessons/git-on-your-computer';

// As we create new lessons, we can add new objects to the lessons array.
const lessons = [
  {
    name: 'Git on your computer',
    content: lesson1,
    iconPath: 'assets/git-icon.png',
  },
];

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.showLesson = this.showLesson.bind(this);
    this.setStructureAnimationVisibility = this.setStructureAnimationVisibility.bind(this);
    this.hideLesson = this.hideLesson.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

  setStructureAnimationVisibility(boolean) {
    this.setState({
      structureAnimationVisible: boolean,
    });
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
        // Again, I'd like to set the lesson dynamically down the line.
        lessonText: this.state.lessonContent[this.state.slideNumber + 1].lessonText,
        buttonText: this.state.lessonContent[this.state.slideNumber + 1].buttonText,
        errorMessage: '',
      });
    }
  }

  handleClick() {
    // If this slide has a buttonFunction, run it.
    if (this.state.lessonContent[this.state.slideNumber].buttonFunction) {
      this.state.lessonContent[this.state.slideNumber].buttonFunction();
      // Listen for the result of the test triggered by buttonFunction
      // (since I can't get the buttonFunction to return a Boolean, which would be simpler).
      // I changed .on to .once
      // Refactoring opportunity: pull out and name this function.
      ipcRenderer.once('test-result-2', function (event, arg) {
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
  }

  showError() {
    this.setState({
      errorMessage: this.state.lessonContent[this.state.slideNumber].errorMessage,
    });
  }

  toggleSidebar() {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
    });
  }

  hideLesson() {
    this.setState({
      lessonVisible: false,
    });
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
      lessonVisible: true,
    });
  }

  // Not sure whether the button and the handleClick function should live on Dashboard or on Lesson.
  render() {
    // Put styling in a separate function that render can call.
    const sidebarStyle = { padding: '8px' };
    const sidebarContainerStyle = { height: '100%', backgroundColor: 'lightGray' };
    const mainStyle = { height: '100%' };
    const upperHalfStyle = { height: '50%', width: '100%' };
    const lowerHalfStyle = { height: '50%', width: '100%' };
    // Isaac: I'm not sure whether overflow should be auto or scroll.
    const leftStyle = { float: 'left', height: '100%', overflow: 'scroll' };
    const terminalStyle = { float: 'left', height: '100%', backgroundColor: 'black' };

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
    } else {
      leftStyle.display = 'none';
      terminalStyle.width = '100%';
    }

    // Create an array of lesson names to pass down as props.
    // (We don't want to pass all the lesson contents - that's a lot of data.)
    const lessonInfo = lessons.map(lesson =>
      ({
        name: lesson.name,
        iconPath: lesson.iconPath,
      })
    );

    // The image is from https://www.iconfinder.com/icons/134216/hamburger_lines_menu_icon#size=32
    return (
      <div id="Dashboard" style={ { height: '100%', width: '100%' } }>
        <div id="sidebar-container" style={ sidebarContainerStyle }>
          <img src="assets/setting-icon.png" onClick={ this.toggleSidebar }
            height="12px" width="12px" style={ { padding: '8px' } }
          />
          <Sidebar style={ sidebarStyle } showLesson={ this.showLesson }
            lessonInfo={ lessonInfo } lessonNumber={ this.state.lessonNumber }
            lessonVisible={ this.state.lessonVisible }
          />
        </div>
        <div id="main" style={ mainStyle }>
          <div id="upper-half" style={ upperHalfStyle }>
            <Animation structureAnimationVisible={ this.state.structureAnimationVisible }
              setStructureAnimationVisibility={ this.setStructureAnimationVisibility }
              sidebarVisible={ this.state.sidebarVisible }
            />
          </div>
          <div id="lower-half" style={ lowerHalfStyle }>
            <div id="left" style={ leftStyle }>
              <div className="add-padding">
                <Lesson totalNumberOfSlides={ this.state.totalNumberOfSlides }
                  slideNumber={ this.state.slideNumber } lessonText={ this.state.lessonText }
                  hideLesson={ this.hideLesson }
                />
                <button onClick={ this.handleClick }>{ this.state.buttonText }</button>
                <p><strong>{ this.state.errorMessage }</strong></p>
              </div>
            </div>
            <Terminal style={ terminalStyle } />
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  initialSidebarVisible: React.PropTypes.bool,
  initialLessonVisible: React.PropTypes.bool,
  initialStructureAnimationVisible: React.PropTypes.bool,
};

Dashboard.defaultProps = {
  initialSidebarVisible: true,
  initialLessonVisible: false,
  initialStructureAnimationVisible: true,
};

render(<Dashboard />, document.getElementById('dashboard-container'));
