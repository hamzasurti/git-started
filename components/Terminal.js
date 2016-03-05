import React, {Component} from 'react';
const Term = require('term.js');



// I can't get app.js to run here. In fact, the script tag doesn't object if I give it an invalid address like 'tomato'. We can add this script back after the form element if needed: <script src='./../app'></script>
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
