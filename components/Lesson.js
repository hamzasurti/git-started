import React, {Component} from 'react';

export default class Lesson extends Component {
  render() {
    return (
      <div id='Lesson'>
      	Lesson
      	{this.props.lessonText}
      </div>
    )
  }
}