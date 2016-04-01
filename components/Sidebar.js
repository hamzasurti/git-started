import React, {Component} from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here if we have these features.
export default class Sidebar extends Component {

  handleClick(index) {
    this.props.showLesson(index);
  }

  buildStyles(sidebarVisible) {
    const style = { padding: '8px' };
    style.display = sidebarVisible ? 'block' : 'none';
    return style;
  }

  render() {
    const sidebarStyle = this.buildStyles(this.props.sidebarVisible);
    var buttonStyle = {textAlign: 'left'};
    var textStyle = {paddingLeft: '16px'};

    var lessons = this.props.lessonInfo.map((lesson, index) => {
      var image = <div style={{float: 'left', paddingTop: '2px', paddingBottom: '2px'}}><img src={lesson.iconPath} alt='' height='12px' width='12px' /></div>;
      // How to render the current lesson
      if (this.props.lessonNumber === index && this.props.lessonVisible) {
        return (
          <button key={index} style={buttonStyle}>
            {image}
            <div style={textStyle}>
              <strong>{lesson.name}</strong>
            </div>
          </button>
        )
      // How to render all other lessons
      } else {
        return (
          <button key={index} style={buttonStyle} onClick={this.handleClick.bind(this, index)}>
            {image}
            <div style={textStyle}>
              <span>{lesson.name}</span>
            </div>
          </button>
        )
      }
    });

    return (
      <div style={sidebarStyle} id='Sidebar'>
        <img src='' alt='Awesome logo here!' />
        <p>Choose a tutorial:</p>
        {lessons}
      </div>
    )
  }
}
