import React, { Component } from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here
// if we have these features.
export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(index) {
    this.props.showLesson(index);
  }

  buildStyles(sidebarVisible) {
    const styles = {};

    styles.main = { padding: '8px' };
    styles.main.display = sidebarVisible ? 'block' : 'none';
    styles.button = { textAlign: 'left' };
    styles.text = { paddingLeft: '16px' };
    styles.image = { float: 'left', paddingTop: '2px', paddingBottom: '2px' };

    return styles;
  }

  buildLessonList(lessonInfo, lessonNumber, lessonVisible, styles, handleClick) {
    const lessonList = lessonInfo.map((lesson, index) => {
      const image = (
        <div style={styles.image}>
          <img src={lesson.iconPath} alt="" height="12px" width="12px" />
        </div>
      );

      // How to render the current lesson
      if (lessonNumber === index && lessonVisible) {
        return (
          <button key={index} style={styles.button}>
            {image}
            <div style={styles.text}>
              <strong>{lesson.name}</strong>
            </div>
          </button>
        );

      // How to render all other lessons
      }
      return (
        <button key={index} style={styles.button} onClick={ () => { handleClick(index); } }>
          {image}
          <div style={styles.text}>
            <span>{lesson.name}</span>
          </div>
        </button>
      );
    });
    return lessonList;
  }

  render() {
    const styles = this.buildStyles(this.props.sidebarVisible);

    const lessonList = this.buildLessonList(this.props.lessonInfo, this.props.lessonNumber,
      this.props.lessonVisible, styles, this.handleClick);

    return (
      <div style={styles.main} id="Sidebar">
        <img src="assets/app-icon.png" width="64px" alt="Awesome logo here!" />
        <p>Choose a tutorial:</p>
        {lessonList}
      </div>
    );
  }
}

Sidebar.propTypes = {
  showLesson: React.PropTypes.func,
  lessonInfo: React.PropTypes.array,
  lessonNumber: React.PropTypes.number,
  lessonVisible: React.PropTypes.bool,
  sidebarVisible: React.PropTypes.bool,
};
