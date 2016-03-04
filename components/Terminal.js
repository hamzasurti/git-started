import React, {Component} from 'react';

export default class Terminal extends Component {
  render() {
    return (
      <div id='Terminal'>
      	Terminal
      	<div class="current"></div>
				<form>
					<input type="text" autocomplete="on" />
				</form>
				<script>
					require('./../app.js');
				</script>
      </div>
    )
  }
}