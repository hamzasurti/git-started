import React, {Component} from 'react';

export default class Lesson extends Component {
  
  handleClick() {
  	console.log('handleClick is running.');
  	this.setState({
  		slideNumber: this.props.slideNumber + 1
  	});

  	console.log('setState ran. this is', this);//this.props.slideNumber is', this.props.slideNumber);//.bind(this);
  	this.setState({
  		lessonText: this.props.lesson[this.props.slideNumber].lessonText
  	});
  }

  render() {
    return (
      <div id='Lesson'>
      	{this.props.lessonText}
      	<button onClick={this.handleClick.bind(this)}>Press me for details</button>
      </div>
    )
  }
}

// Previously: {this.props.lessonText.map(function(element) {return})}
// handleClick is running, but lessonText isn't updating.
// Why is this.props.lesson[this.props.slideNumber] undefined? I'm assuming this.props.lesson is defined. Is it a reference to the correct file? Or just a string?
// Had 'lessonText: this.props.lesson[this.props.slideNumber].lessonText' in setSate; this.props.lesson didn't do anything.
// Should I show the lesson name somewhere?