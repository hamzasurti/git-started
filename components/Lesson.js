import React, {Component} from 'react';

export default class Lesson extends Component {

  render() {
    return (
      <div id='Lesson'>
      	{this.props.lessonText}
      	<button onClick={this.props.handleClick}>Press me for details</button>
      </div>
    )
  }
}

// Should I show the lesson name somewhere?