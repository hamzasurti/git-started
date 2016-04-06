/* eslint-disable no-console */
import React, { Component } from 'react';
import { render } from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Sidebar from './Sidebar';
import Terminal from './Terminal';

import lessons from './../lessons/lesson-list';

export default class Dashboard extends Component {
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
  }

  render() {
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
  initialStructureAnimationVisible: true, // set to false for test?
  initialLessonVisible: false,
  initialErrorVisible: false,
};

render(<Dashboard />, document.getElementById('dashboard-container'));
