import React, {Component} from 'react';

export default class Lesson extends Component {
  render() {
    return (
      <div id='Lesson'>
      	{this.props.lessonText}
      	<button onClick={this.props.buttonFunction}>Press me for details</button>
      </div>
    )
  }
}

// Previously: {this.props.lessonText.map(function(element) {return})}