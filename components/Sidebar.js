import React, { Component } from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here
// if we have these features.
export default class Sidebar extends Component {

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

  render() {
    const styles = this.buildStyles(this.props.sidebarVisible);

    const lessons = this.props.lessonInfo.map((lesson, index) => {
      const image = (
        <div style={styles.image}>
          <img src={lesson.iconPath} alt="" height="12px" width="12px" />
        </div>
      );
      // How to render the current lesson
      if (this.props.lessonNumber === index && this.props.lessonVisible) {
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
        // The reason I'm binding here is that I need to pass the index as a parameter.
        // I'm not sure how to fix this without using event.target.
        <button key={index} style={styles.button} onClick={this.handleClick.bind(this, index)}>
          {image}
          <div style={styles.text}>
            <span>{lesson.name}</span>
          </div>
        </button>
      );
    });

    return (
      <div style={styles.main} id="Sidebar">
        <img src="" alt="Awesome logo here!" />
        <p>Choose a tutorial:</p>
        {lessons}
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
