/* eslint-disable no-console */
import React, { Component } from 'react';
import { render } from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Sidebar from './Sidebar';
import Terminal from './Terminal';
// import downCarrot from './assets/downCarrot'


import lessons from './../lessons/lesson-list';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.setErrorVisibility = this.setErrorVisibility.bind(this);
    this.setStructureAnimationVisibility = this.setStructureAnimationVisibility.bind(this);
    this.setDropdownVisibility = this.setDropdownVisibility.bind(this);
    this.showLesson = this.showLesson.bind(this);
    this.hideLesson = this.hideLesson.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.state = {
      lessonNumber: 0,
      slideNumber: 0,
      DropdownVisible: props.initialDropdownVisible,
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

  setDropdownVisibility() {
    this.setState({
      DropdownVisible: !this.state.DropdownVisible,
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

  buildStyles(DropdownVisible) {
    const styles = {};

    styles.dashboard = { height: '100%', width: '100%' };
    styles.sidebar = { height: '40px', width: '100%', backgroundColor: 'tranparent', borderBottom: '1px solid #D2D2D2' };
    styles.settingsIcon = { padding: '8px' };
    styles.main = { height: '100vh', width: '100%'};
    styles.upperHalf = { height: '55%', width: '100%' };
    styles.lowerHalf = { height: '45%', width: '100%', backgroundColor: '#151414', 'borderTop':'10px solid #D2D2D2' };

    // if (DropdownVisible) {
    //   styles.sidebar.position = 'absolute';
    // } else {
    //   styles.sidebar.position = 'absolute';
    //   styles.main.position = 'absolute';
    //   styles.main.left = '0';
    //   styles.main.right = 0;
    // }

    return styles;
  }

  render() {
    const styles = this.buildStyles(this.state.DropdownVisible);
    console.log('render being called');
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
          <Sidebar showLesson={ this.showLesson }
            dropdownVisibility={ this.setDropdownVisibility }
            lessonInfo={ lessonInfo } lessonNumber={ this.state.lessonNumber }
            lessonVisible={ this.state.lessonVisible } DropdownVisible={ this.state.DropdownVisible }
          />
        </div>
        <div style={ styles.main }>
          <div style={ styles.upperHalf }>
            <Animation structureAnimationVisible={ this.state.structureAnimationVisible }
              setStructureAnimationVisibility={ this.setStructureAnimationVisibility }
              DropdownVisible={ this.state.DropdownVisible }
            />
            <span style={{textAlign: 'center', marginLeft: '10%', bottom: '45%', position: 'absolute', color: '#B0AEAE', fontSize: '300%', fontFamily: 'monospace'}}> gTerm</span>
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
  initialDropdownVisible: React.PropTypes.bool,
  initialStructureAnimationVisible: React.PropTypes.bool,
  initialLessonVisible: React.PropTypes.bool,
  initialErrorVisible: React.PropTypes.bool,
};

Dashboard.defaultProps = {
  initialDropdownVisible: false,
  initialStructureAnimationVisible: true,
  initialLessonVisible: true,
  initialErrorVisible: false,
};

render(<Dashboard />, document.getElementById('dashboard-container'));
