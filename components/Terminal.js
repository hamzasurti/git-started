import React, {Component} from 'react';

// Can you require files in script tags in JSX? I'm not sure app.js is running. 
export default class Terminal extends Component {
  render() {
    return (
      <div id='Terminal'>
      	Terminal
      	<div className="current"></div>
				<form>
					<input type="text" autoComplete="on" />
				</form>
				<script>
					require('./../app.js');
				</script>
      </div>
    )
  }
}