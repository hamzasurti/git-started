import React, {Component} from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here if we have these features.
export default class Sidebar extends Component {
  render() {
    return (
      <div style={this.props.style} id='Sidebar'>
        Awesome logo here!
      </div>
    )
  }
}
