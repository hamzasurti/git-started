import React, {Component} from 'react';
import GitAnimation from './GitAnimation';
import StructureAnimation from './StructureAnimation';

export default class Animation extends Component {

  showGit() {
    this.props.setStructureAnimationVisibility(false);
    // this.setState({
    //   structureAnimationVisible: false
    // })
  }

  showStructure() {
    this.props.setStructureAnimationVisibility(true);
    // this.setState({
    //   structureAnimationVisible: true
    // })
  }

  render() {
    var selectedAnimation;
    var gitStyle = {
      borderBottom: '1px solid black',
      padding: '1rem'
     };
    var structureStyle = {padding: '1rem'};

    if (this.props.structureAnimationVisible) {
      // What to show for structure Animation
      selectedAnimation = <StructureAnimation />;
      gitStyle.backgroundColor = 'transparent';
      structureStyle.backgroundColor = 'lightBlue';
    } else {
      // What to show for Git Animation
      selectedAnimation = <GitAnimation />;
      gitStyle.backgroundColor = 'lightBlue';
      structureStyle.backgroundColor = 'transparent';
    }

    return (
      <div id='Animation' style={{overflow: 'auto'}}>
        <div className='add-padding'>
          <div style={{float: 'right', border: '1px solid black'}}>
            <div style={gitStyle} onClick={this.showGit.bind(this)}>Git view</div>
            <div style={structureStyle} onClick={this.showStructure.bind(this)}>Directory view</div>
          </div>
          {selectedAnimation}
        </div>
      </div>
    )
  }
}
