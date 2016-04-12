import React, { Component } from 'react';
import GitAnimation from './GitAnimation';
import StructureAnimation from './StructureAnimation';

export default class Animation extends Component {
  constructor(props) {
    super(props);
    this.showGit = this.showGit.bind(this);
    this.showStructure = this.showStructure.bind(this);
  }

  showGit() {
    this.props.setStructureAnimationVisibility(false);
  }

  showStructure() {
    this.props.setStructureAnimationVisibility(true);
  }

  buildStyles(structureAnimationVisible) {
    const styles = {};


    styles.padder = { padding: '16px' };
    styles.toggle = { float: 'right', border: '1px solid black', textAlign: 'center',position: 'absolute', right: '13px', 'z-index':0 };
    styles.git = { borderBottom: '1px solid black', padding: '2px 2px 0px 2px' };
    styles.structure = { padding: '2px 2px 0px 2px' };

    if (structureAnimationVisible) {
      styles.git.backgroundColor = 'transparent';
      styles.structure.backgroundColor = 'lightBlue';
    } else {
      styles.git.backgroundColor = 'lightBlue';
      styles.structure.backgroundColor = 'transparent';
    }

    return styles;
  }

  // Images from https://www.iconfinder.com/icons/172515/folder_opened_icon#size=32
  // and https://www.iconfinder.com/icons/83306/git_icon#size=32
  render() {
    const selectedAnimation = this.props.structureAnimationVisible ?
      <StructureAnimation sidebarVisible={this.props.sidebarVisible} /> :
      <GitAnimation />;

    const styles = this.buildStyles(this.props.structureAnimationVisible);

    return (
      <div id="Animation">
        <div style={ styles.padder }>
          <div style={ styles.toggle }>
            <div style={ styles.git } onClick={this.showGit}>
              <img src="assets/git-icon.png" alt="Git view" height="12" width="12" />
            </div>
            <div style={ styles.structure } onClick={this.showStructure}>
              <img src="assets/folder-icon.png" alt="Directory view" height="12" width="12" />
            </div>
          </div>
          {selectedAnimation}
        </div>
      </div>
    );
  }
}




Animation.propTypes = {
  padderStyle: React.PropTypes.object,
  setStructureAnimationVisibility: React.PropTypes.func,
  sidebarVisible: React.PropTypes.bool,
  structureAnimationVisible: React.PropTypes.bool,
};
