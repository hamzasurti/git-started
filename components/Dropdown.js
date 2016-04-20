import React, { Component } from 'react';

export default class Dropdown extends Component {
  buildLessonList(lessonInfo) {
    const style = {
      padding: '15px 15px 15px 15px',
      border: '1px solid #F9F9F9',
      backgroundColor: 'white',
      fontFamily: 'sans-serif',
      fontSize: '80%',
      color: '#A09E9E',
      maxHeight: '0',
      transition: 'max-height 500ms ease!important',
    };

    const lessonList = lessonInfo.map((lesson, index) => {
      const lessonArr = [];
      for (let i = 0; i < 3; i++) {
        lessonArr.push(
          <li onClick={() => this.props.showLesson(0)} style={style}>
            <strong>{i === 0 ? lesson.name : `GitHub ${i}`}</strong>
          </li>
        );
      }

        return (
          <ul style={{listStyle: "none",padding: '0',margin: '0', marginTop: '14px'}} key={index} >
            {lessonArr}
          </ul>
        );
    });

    console.log("Here's lessonList. Seriously, WTF?", lessonList);
    return lessonList;
  }

  buildStyle() {
    return { position: 'absolute', right: 10, backgroundColor: 'tranparent', zIndex: 2,
     fontFamily: 'sans-serif', transform: 'translateY(11px)',  color: '#A09E9E', textAlign: 'right',
    }
  }

  render() {
    const lessonList = this.props.dropdownVisible ? this.buildLessonList(this.props.lessonInfo, this.props.lessonNumber,
      this.props.lessonVisible, this.handleClick) : undefined;

    const style = this.buildStyle();

    return (
      <div id="Dropdown" style={style}  onClick={this.props.dropdownVisibility}>
        &#9662; Lessons
        {lessonList}
      </div>
    );
  }
}

Dropdown.propTypes = {
  showLesson: React.PropTypes.func,
  lessonInfo: React.PropTypes.array,
  lessonNumber: React.PropTypes.number,
  lessonVisible: React.PropTypes.bool,
  dropdownVisible: React.PropTypes.bool,
};
