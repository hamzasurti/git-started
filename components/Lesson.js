/* eslint-disable no-undef */
// We don't need to define ipcRenderer because it will be loaded by the time this file runs.

import React, { Component } from 'react';
import lessons from './../lessons/lesson-list';

export default class Lesson extends Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(lesson, slideNumber, errorVisible) {
    // If this slide has a buttonFunction, run it.
    if (lesson[slideNumber].buttonFunction) {
      lesson[slideNumber].buttonFunction();

      // Listen for the result of the buttonFunction test.
      ipcRenderer.once('test-result-2', (event, arg) => {
        // If the user passed the test (if arg is true), advance and hide the error message.
        if (arg) {
          this.advance(lesson, slideNumber);
          if (errorVisible) this.props.setErrorVisibility(false);
        // If the user failed the test, show the error message.
        } else {
          this.props.setErrorVisibility(true);
        }
      });

    // If the slide does not have a buttonFunction, simply advance.
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

  buildStyles() {
    const styles = {};

    styles.lesson = { float: 'left', height: '100%', width: '35%', overflow: 'scroll',
     fontFamily: 'Helvetica, sans-serif', backgroundColor: 'white' };
    styles.padder = { padding: '16px' };
    styles.img = { float: 'right' };
    styles.error = { color: 'red' };

    return styles;
  }

  // The X icon is from https://www.iconfinder.com/icons/118584/x_icon#size=32
  render() {
    const currentLesson = lessons[this.props.lessonNumber].content;
    const styles = this.buildStyles();

    // Render the error message only if it should be visible.
    const error = this.props.errorVisible ?
      <p>
        <strong style={styles.error}>{ currentLesson[this.props.slideNumber].errorMessage }</strong>
      </p> :
      undefined;

    return (
      <div style={ styles.lesson } id="Lesson">
        <div style={ styles.padder }>
          <div>
            <img src="assets/x-icon.png" alt="Click here to close this tutorial" height="16px"
              style={ styles.img } onClick={ this.props.hideLesson }
            />
            <em>Slide {this.props.slideNumber + 1} of {currentLesson.length}</em>
            {currentLesson[this.props.slideNumber].lessonText}
            {error}
            <button onClick={ () => {
              this.handleButtonClick(currentLesson, this.props.slideNumber,
                this.props.errorVisible); }
              }
            >
              { currentLesson[this.props.slideNumber].buttonText }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Lesson.propTypes = {
  lessonNumber: React.PropTypes.number,
  slideNumber: React.PropTypes.number,
  errorVisible: React.PropTypes.bool,
  changeSlide: React.PropTypes.func,
  hideLesson: React.PropTypes.func,
  setErrorVisibility: React.PropTypes.func,
};
