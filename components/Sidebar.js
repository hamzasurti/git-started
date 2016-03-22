import React, {Component} from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here if we have these features.
export default class Sidebar extends Component {

  handleClick(index) {
    this.props.showLesson(index);
  }

  render() {

    var lessons = this.props.lessonNames.map((lessonName, index) => {
      // How to render the current lesson
      if (this.props.lessonNumber === index && this.props.lessonVisible) {
        return (
          <li key={index}>
            <strong>
              {lessonName}
            </strong>
          </li>
        )
      // How to render all other lessons
      } else {
        return (
          <li key={index}>
            <a href='#' onClick={this.handleClick.bind(this, index)}>
              {lessonName}
            </a>
          </li>
        )
      }
    });

    return (
      <div style={this.props.style} id='Sidebar'>
        <img src='' alt='Awesome logo here!' />
        <p>Choose a tutorial:</p>
        <ul>
          {lessons}
        </ul>
      </div>
    )
  }
}
