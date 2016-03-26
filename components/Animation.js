import React, {Component} from 'react';
import GitAnimation from './GitAnimation';

// Notes from Isaac
// I've included two options here: StructureAnimation (which is what we're currently using) and IsaacsHalfwayFinishedComponent (which we're not currently using).
// To toggle between them, simply comment out one of the two lines below.
// import StructureAnimation from './StructureAnimation';
import StructureAnimation from './HalfwayFinishedStructureAnimation';

export default class Animation extends Component {

  showGit() {
    this.props.setStructureAnimationVisibility(false);
  }

  showStructure() {
    this.props.setStructureAnimationVisibility(true);
  }

  // Images from https://www.iconfinder.com/icons/172515/folder_opened_icon#size=32 and https://www.iconfinder.com/icons/83306/git_icon#size=32
  render() {
    var selectedAnimation;
    var gitStyle = {
      borderBottom: '1px solid black',
      padding: '2px 2px 0px 2px'
     };
    var structureStyle = {padding: '2px 2px 0px 2px'};

    if (this.props.structureAnimationVisible) {
      // What to show for structure Animation
      selectedAnimation = <StructureAnimation sidebarVisible=
      {this.props.sidebarVisible} />;
      gitStyle.backgroundColor = 'transparent';
      structureStyle.backgroundColor = 'lightBlue';
    } else {
      // What to show for Git Animation
      selectedAnimation = <GitAnimation />;
      gitStyle.backgroundColor = 'lightBlue';
      structureStyle.backgroundColor = 'transparent';
    }

    return (
      <div id='Animation'>
        <div className='add-padding'>
          <div style={{float: 'right', border: '1px solid black', textAlign: 'center'}}>
            <div style={gitStyle} onClick={this.showGit.bind(this)}>
              <img src='assets/git-icon.png' alt='Git view' height='12' width='12'/>
            </div>
            <div style={structureStyle} onClick={this.showStructure.bind(this)}>
              <img src='assets/folder-icon.png' alt='Directory view' height='12' width='12' />
            </div>
          </div>
          {selectedAnimation}
        </div>
      </div>
    )
  }
}
