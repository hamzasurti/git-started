import React, {Component} from 'react';

export default class Lesson extends Component {

  render() {
    return (
      <div id='Lesson'>
        <em>Slide {this.props.slideNumber + 1} of {this.props.totalNumberOfSlides}</em>
      	{this.props.lessonText}
      </div>
    )
  }
}

// Isaac: I added the 'em' tag above for testing only.

// Should I show the lesson name somewhere?
// <p>For testing only: Slide #{this.props.slideNumber}</p>
