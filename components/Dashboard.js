/* eslint-disable no-console */
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
      ipcRenderer.once('test-result-2', (event, arg) => {
        console.log('result', arg);
        // If the user passed the test (if arg is true), advance.
        if (arg) {
          this.advance();
        } else {
          this.showError();
        }
      });
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

  buildStyles(sidebarVisible, lessonVisible) {
    const styles = {};

    styles.dashboard = { height: '100%', width: '100%' };
    styles.sidebar = { height: '100%', backgroundColor: 'lightGray' };
    styles.settingIcon = { padding: '8px' };
    styles.main = { height: '100%' };
    styles.upperHalf = { height: '50%', width: '100%' };
    styles.lowerHalf = { height: '50%', width: '100%' };
    // Isaac: I'm not sure whether overflow should be auto or scroll.
    styles.lesson = { float: 'left', height: '100%', overflow: 'scroll' };
    styles.padder = { padding: '16px' };

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

    if (lessonVisible) {
      styles.lesson.width = '35%';
    } else {
      styles.lesson.display = 'none';
    }

    return styles;
  }

  // Not sure whether the button and the handleClick function should live on Dashboard or on Lesson.
  render() {
    // Create an array of lesson names to pass down as props.
    // (We don't want to pass all the lesson contents - that's a lot of data.)
    const lessonInfo = lessons.map(lesson =>
      ({
        name: lesson.name,
        iconPath: lesson.iconPath,
      })
    );

    const styles = this.buildStyles(this.state.sidebarVisible, this.state.lessonVisible);
    // The image is from https://www.iconfinder.com/icons/134216/hamburger_lines_menu_icon#size=32
    return (
      <div id="Dashboard" style={ styles.dashboard }>
        <div style={ styles.sidebar }>
          <img src="assets/setting-icon.png" onClick={ this.toggleSidebar }
            height="12px" width="12px" style={ styles.settingIcon }
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
              sidebarVisible={ this.state.sidebarVisible } padderStyle = { styles.padder }
            />
          </div>
          <div style={ styles.lowerHalf }>
            <div style={ styles.lesson }>
              <div style={ styles.padder }>
                <Lesson totalNumberOfSlides={ this.state.totalNumberOfSlides }
                  slideNumber={ this.state.slideNumber } lessonText={ this.state.lessonText }
                  hideLesson={ this.hideLesson }
                />
                <button onClick={ this.handleClick }>{ this.state.buttonText }</button>
                <p><strong>{ this.state.errorMessage }</strong></p>
              </div>
            </div>
            <Terminal lessonVisible={ this.state.lessonVisible } />
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
