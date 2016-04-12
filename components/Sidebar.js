import React, { Component } from 'react';


// We could add navigation, contact/help, search, progress indicators, and login here
// if we have these features.
export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    // this.handleClick = this.handleClick.bind(this);
  }

  buildLessonList(lessonInfo, lessonNumber, lessonVisible, handleClick) {
    const lessonList = lessonInfo.map((lesson, index) => {
      const lessonArr = [];
      for (let i = 0; i < 3; i++) {
        lessonArr.push(<li onClick={() => this.props.showLesson(0)} style={ {
          padding: '15px 15px 15px 15px',
          border: '1px solid #F9F9F9',
          backgroundColor: 'white',
          fontFamily: 'sans-serif',
          fontSize: '80%',
          color: '#A09E9E',
        } }
        >
        <strong>{i === 0 ? lesson.name : `GitHub ${i}`}</strong>
        </li>);
      }

      // How to render the current lesson
        return (
          <ul style={{listStyle: "none",padding: '0',margin: '0', marginTop: '14px'}} key={index} >
            {lessonArr}
          </ul>
        );
    });
    return lessonList;
  }

  render() {

    const lessonList = this.props.DropdownVisible ? this.buildLessonList(this.props.lessonInfo, this.props.lessonNumber,
      this.props.lessonVisible, this.handleClick) : undefined;

    return (
      <div  id="Dropdown" style={{
        "position": "absolute", right: "10",backgroundColor: "tranparent", 'zIndex': 2, fontFamily: 'sans-serif', transform: 'translateY(11px)',  color: '#A09E9E', textAlign : 'right',
      }}  onClick={this.props.dropdownVisibility}>
        &#9662; Lessons
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
  DropdownVisible: React.PropTypes.bool,
};
