import React, {Component} from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here if we have these features.
export default class Sidebar extends Component {

  handleClick() {
    // this is null
    this.props.hideLesson();
  }

  render() {
    return (
      <div style={this.props.style} id='Sidebar'>
        <img src='' alt='Awesome logo here!' />
        <p>Choose a tutorial:</p>
        <ul>
          <li>Example</li>
        </ul>
        <button onClick={this.handleClick.bind(this)}>Hide tutorial panel</button>
      </div>
    )
  }
}
