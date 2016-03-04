import React, {Component} from 'react';

export default class Lesson extends Component {
  render() {
    return (
      <div id='Lesson'>
      	{this.props.lessonText}
      </div>
    )
  }
}

// Previously: {this.props.lessonText.map(function(element) {return})}