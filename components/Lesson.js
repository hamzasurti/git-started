import React, {Component} from 'react';

export default class Lesson extends Component {

  handleClick() {
    this.props.hideLesson();
  }

  render() {
    return (
      <div id='Lesson'>
        <img src='' alt='Show X here and wrap around it' onClick={this.handleClick.bind(this)}/>
        <em>Slide {this.props.slideNumber + 1} of {this.props.totalNumberOfSlides}</em>
      	{this.props.lessonText}
      </div>
    )
  }
}

// Isaac: I added the 'em' tag above for testing only.

// Should I show the lesson name somewhere?
// <p>For testing only: Slide #{this.props.slideNumber}</p>
