/* eslint-disable no-console */
import React, { Component } from 'react';
import lessons from './../lessons/lesson-list';

export default class Lesson extends Component {
  constructor(props) {
    super(props);
    this.exit = this.exit.bind(this);
    this.runTest = this.runTest.bind(this);
  }

  exit() {
    this.props.hideLesson();
  }

  runTest(lesson, slideNumber) {
    // If this slide has a buttonFunction, run it.
    if (lesson[slideNumber].buttonFunction) {
      lesson[slideNumber].buttonFunction();
      // Listen for the result of the test triggered by buttonFunction
      // (since I can't get the buttonFunction to return a Boolean, which would be simpler).
      ipcRenderer.once('test-result-2', (event, arg) => {
        console.log('result', arg);
        // If the user passed the test (if arg is true), advance.
        if (arg) {
          this.advance(lesson, slideNumber);
          this.props.setErrorVisibility(false);
        } else {
          this.props.setErrorVisibility(true);
        }
      });
    } else {
      this.advance(lesson, slideNumber);
    }
  }

  advance(lesson, slideNumber) {
    // If we're on the last slide, go to slide 0.
    // If not, go to the next slide.
    const destination = slideNumber === lesson.length - 1 ? 0 : slideNumber + 1;
    this.props.changeSlide(destination);
  }

  // The image is from https://www.iconfinder.com/icons/118584/x_icon#size=32
  render() {
    const currentLesson = lessons[this.props.lessonNumber].content; // the slide deck
    const error = this.props.errorVisible ?
      <p><strong>{ currentLesson[this.props.slideNumber].errorMessage }</strong></p> :
      undefined;

    return (
      <div id="Lesson">
        <img src="assets/x-icon.png" alt="Click here to close this tutorial" height="12px"
          width="12px" style={ { float: 'right' } } onClick={this.exit}
        />
        <em>Slide {this.props.slideNumber + 1} of {currentLesson.length}</em>
        {currentLesson[this.props.slideNumber].lessonText}
        <button onClick={ () => { this.runTest(currentLesson, this.props.slideNumber); } }>
          { currentLesson[this.props.slideNumber].buttonText }
        </button>
        {error}
      </div>
    );
  }
}

Lesson.propTypes = {
  lessonNumber: React.PropTypes.number,
  slideNumber: React.PropTypes.number,
  changeSlide: React.PropTypes.func,
  hideLesson: React.PropTypes.func,
  errorVisible: React.PropTypes.bool,
  setErrorVisibility: React.PropTypes.func,
};
