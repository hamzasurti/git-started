import React, { Component } from 'react';
import { render } from 'react-dom';

// Import other components here
import Animation from './Animation';
import Lesson from './Lesson';
import Dropdown from './Dropdown';
import Terminal from './Terminal';

// Import the list of existing lessons
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
      lessonNumber: undefined,
      slideNumber: undefined,
      dropdownVisible: props.initialDropdownVisible,
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
      dropdownVisible: !this.state.dropdownVisible,
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

  buildStyles() {
    const styles = {};

    styles.dashboard = { height: '100%', width: '100%' };
    styles.dropdown = { height: '40px', width: '100%', backgroundColor: 'tranparent',
     borderBottom: '1px solid #D2D2D2' };
    styles.main = { height: '100vh', width: '100%' };
    styles.upperHalf = { height: '55%', width: '100%' };
    styles.span = { textAlign: 'center', marginLeft: '10%', bottom: '45%', position: 'absolute',
     color: '#B0AEAE', fontSize: '300%', fontFamily: 'monospace' };
    styles.lowerHalf = { height: '45%', width: '100%', backgroundColor: '#151414',
     borderTop: '10px solid #D2D2D2' };

    return styles;
  }

  render() {
    const styles = this.buildStyles();

    // Create an array of lesson names to pass down to Dropdown as props.
    // (We don't need to pass down all the lesson contents.)
    const lessonInfo = lessons.map(lesson =>
      ({
        name: lesson.name,
        iconPath: lesson.iconPath,
      })
    );

    // Render the lesson only if it should be visible.
    const lesson = this.state.lessonVisible ?
      <Lesson lessonNumber={ this.state.lessonNumber } slideNumber={ this.state.slideNumber }
        styles={ styles } errorVisible={ this.state.errorVisible } changeSlide={ this.changeSlide }
        hideLesson={ this.hideLesson } setErrorVisibility={ this.setErrorVisibility }
      /> : undefined;

    return (
      <div id="Dashboard" style={ styles.dashboard }>
        <div style={ styles.dropdown }>
          <Dropdown showLesson={ this.showLesson }
            dropdownVisibility={ this.setDropdownVisibility }
            lessonInfo={ lessonInfo } lessonNumber={ this.state.lessonNumber }
            lessonVisible={ this.state.lessonVisible }
            dropdownVisible={ this.state.dropdownVisible }
          />
        </div>
        <div style={ styles.main }>
          <div style={ styles.upperHalf }>
            <Animation structureAnimationVisible={ this.state.structureAnimationVisible }
              setStructureAnimationVisibility={ this.setStructureAnimationVisibility }
            />
            <span style={ styles.span }> gTerm</span>
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
  initialLessonVisible: false,
  initialErrorVisible: false,
};

render(<Dashboard />, document.getElementById('dashboard-container'));
