import React, { Component } from 'react';

export default class Dropdown extends Component {
  buildLessonList(lessonInfo, clickFunction) {
    const styles = {};
    styles.li = {
      padding: '15px 15px 15px 15px',
      border: '1px solid #F9F9F9',
      backgroundColor: 'white',
      fontFamily: 'sans-serif',
      fontSize: '80%',
      color: '#A09E9E',
      maxHeight: '0',
      transition: 'max-height 500ms ease!important',
    };
    styles.ul = {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      marginTop: '14px',
    };

    // Create an array of list items, one per lesson.
    // Since we only have one lesson right now, we are hard-coding two decoy lessons.
    const lessonArr = [];
    for (let i = 0; i < 3; i++) {
      lessonArr.push(
        <li onClick={() => clickFunction(0)} style={styles.li} key={i}>
          <strong>{i === 0 ? lessonInfo[i].name : `GitHub ${i}`}</strong>
        </li>
      );
    }

    return <ul style={styles.ul}>{lessonArr}</ul>;
  }

  buildStyle() {
    return {
      position: 'absolute',
      right: 10,
      backgroundColor: 'tranparent',
      zIndex: 2,
      fontFamily: 'sans-serif',
      transform: 'translateY(11px)',
      color: '#A09E9E',
      textAlign: 'right',
    };
  }

  render() {
    // Create a list of lessons only if the dropdown is visible.
    const lessonList = this.props.dropdownVisible ?
      this.buildLessonList(this.props.lessonInfo, this.props.showLesson) : undefined;

    const style = this.buildStyle();

    return (
      <div id="Dropdown" style={style} onClick={this.props.setDropdownVisibility}>
        &#9662; Lessons
        {lessonList}
      </div>
    );
  }
}

Dropdown.propTypes = {
  lessonInfo: React.PropTypes.array,
  showLesson: React.PropTypes.func,
  dropdownVisible: React.PropTypes.bool,
  setDropdownVisibility: React.PropTypes.func,
};
