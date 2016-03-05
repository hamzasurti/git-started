import React, {Component} from 'react';

export default class Terminal extends Component {
  render() {
    return (
      <div id='Terminal'>
      	Terminal
      	<div className="current"></div>
				<form>
					<input type="text" autoComplete="on" />
				</form>
				
      </div>
    )
  }
}