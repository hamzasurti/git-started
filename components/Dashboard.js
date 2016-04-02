/* eslint-disable no-console */
import React, { Component } from 'react';
import { render } from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Sidebar from './Sidebar';
import Terminal from './Terminal';

// Import lesson content
// import { lesson1 } from './../lessons/git-on-your-computer';

// const lessons = [
//   {
//     name: 'Git on your computer',
//     content: lesson1,
//     iconPath: 'assets/git-icon.png',
//   },
// ];

import lessons from './../lessons/lesson-list';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.showLesson = this.showLesson.bind(this);
    this.setStructureAnimationVisibility = this.setStructureAnimationVisibility.bind(this);
    this.setErrorVisibility = this.setErrorVisibility.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.hideLesson = this.hideLesson.bind(this);
    this.state = {
      lessonNumber: undefined,
      // lessonContent: undefined,
      slideNumber: undefined,
      // totalNumberOfSlides: undefined,
      // lessonText: undefined,
      // buttonText: undefined,
      // errorMessage: undefined,
      sidebarVisible: props.initialSidebarVisible,
      lessonVisible: props.initialLessonVisible,
      structureAnimationVisible: props.initialStructureAnimationVisible,
      errorVisible: props.initialErrorVisible,
    };
  }

  setStructureAnimationVisibility(boolean) {
    this.setState({
      structureAnimationVisible: boolean,
    });
  }

  setErrorVisibility(boolean) {
    this.setState({
      errorVisible: boolean,
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
      // lessonContent: lessons[index].content,
      slideNumber: 0,
      // totalNumberOfSlides: lessons[index].content.length,
      // lessonText: lessons[index].content[0].lessonText,
      // buttonText: lessons[index].content[0].buttonText,
      // errorMessage: '',
      lessonVisible: true,
    });
  }

  changeSlide(number) {
    this.setState({
      slideNumber: number,
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
    styles.lesson = { float: 'left', height: '100%', width: '35%', overflow: 'scroll' };
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

    // Do we still need this?
    if (!lessonVisible) styles.lesson.display = 'none';

    return styles;
  }

  render() {
    const styles = this.buildStyles(this.state.sidebarVisible, this.state.lessonVisible);

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
        errorVisible={ this.state.errorVisible } changeSlide={ this.changeSlide }
        hideLesson={ this.hideLesson } setErrorVisibility={ this.setErrorVisibility }
      /> : undefined;

    // Can I pull out the whole styles.lesson div into the lesson component?
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
                {lesson}
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
  initialErrorVisible: React.PropTypes.bool,
};

Dashboard.defaultProps = {
  initialSidebarVisible: true,
  initialLessonVisible: false,
  initialStructureAnimationVisible: true,
  initialErrorVisible: false,
};

render(<Dashboard />, document.getElementById('dashboard-container'));
