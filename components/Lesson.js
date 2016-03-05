import React, {Component} from 'react';

export default class Lesson extends Component {
  
  handleClick() {
  	console.log('handleClick is running. this.props.slideNumber is', this.props.slideNumber);
  	this.setState({
  		slideNumber: 1 // had this.props.slideNumber + 1 // This isn't working either. Can I not setState here?
  	});

  	console.log('setState ran. this.props.slideNumber is', this.props.slideNumber);//.bind(this);

  	// this.setState({
  	// 	lessonText: this.props.lesson[this.props.slideNumber].lessonText
  	// });
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