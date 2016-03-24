import React, {Component} from 'react';

export default class Lesson extends Component {

  handleClick() {
    this.props.hideLesson();
  }

  // The image is from https://www.iconfinder.com/icons/118584/x_icon#size=32
  render() {

    return (
      <div id='Lesson'>
        <img src='assets/x-icon.png' alt='Click here to close this tutorial' height='12px' width='12px' style={{float: 'right'}} onClick={this.handleClick.bind(this)}/>
        <em>Slide {this.props.slideNumber + 1} of {this.props.totalNumberOfSlides}</em>
      	{this.props.lessonText}
      </div>
    )
  }
}
