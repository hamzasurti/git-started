import React, {Component} from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here if we have these features.
export default class Sidebar extends Component {

  handleClick() {
    // this is null
    this.props.hideLesson();
  }

  render() {

    console.log('this.props.lessonNames', this.props.lessonNames);
    var lessons = this.props.lessonNames.map((lessonName, index) => {
      return <li key={index}>{lessonName}</li>
    });
    console.log('lessons', lessons);

    return (
      <div style={this.props.style} id='Sidebar'>
        <img src='' alt='Awesome logo here!' />
        <p>Choose a tutorial:</p>
        <ul>
          {lessons}
        </ul>
        <button onClick={this.handleClick.bind(this)} style={this.props.buttonStyle}>
          Hide tutorial panel
        </button>
      </div>
    )
  }
}
