import React, {Component} from 'react';

// We could add navigation, contact/help, search, progress indicators, and login here if we have these features.
export default class Sidebar extends Component {
  render() {
    var buttonText = this.props.visible ? 'Hide' : 'Show';
    var displayValue = this.props.visible ? 'block' : 'none';

    return (
      <div className='two columns' id='Sidebar' display={displayValue}>
        Sidebar!
        <button>{buttonText}</button>
      </div>
    )
  }

  handleClick() {
    // setState?
    if (this.props.visible) {
      console.log('hiding');
      //hide
    } else {
      console.log('showing');
      //show
    }
  }
}
