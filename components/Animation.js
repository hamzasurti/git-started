import React, {Component} from 'react';
import GitAnimation from './GitAnimation';
import StructureAnimation from './StructureAnimation';

export default class Animation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      structureAnimationVisible: this.props.initialStructureAnimationVisible
    }
  }

  // componentDidMount(){
  //   var mountNode = ReactDOM.findDOMNode(this.refs.treeRender);
  //   // Render the tree usng d3 after first component mount
  //   renderTree(this.state.treeData, mountNode);
  // }
  //
  // shouldComponentUpdate(nextProps, nextState){
  //   // console.log(_.isEqual(this.lastState,nextState));
  //   // console.log(this.lastState, nextState)
  //   if (_.isEqual(this.lastState,nextState)){
  //     return false
  //   } else {
  //     // Delegate rendering the tree to a d3 function on prop change
  //     renderTree(nextState.treeData, ReactDOM.findDOMNode(this.refs.treeRender));
  //     // Do not allow react to render the component on prop change
  //     return false;
  //   }
  // }
  //
  // updateTree(newSchema){
  //   this.lastState = this.state
  //   this.setState({
  //     treeData: newSchema
  //   })
  // }

  showGit() {
    console.log('showing Git');
    this.setState({
      structureAnimationVisible: false
    })
  }

  showStructure() {
    console.log('showing Structure');
    this.setState({
      structureAnimationVisible: true
    })
  }

  render() {
    // ipcRenderer.on('direc-schema', (e,arg)=>{
    //   this.updateTree(arg);
    // })

    console.log('Animation rendering');

    var selectedAnimation;
    var gitStyle = {
      borderBottom: '1px solid black',
      padding: '1rem'
     };
    var structureStyle = {padding: '1rem'};

    if (this.state.structureAnimationVisible) {
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

Animation.defaultProps = {
  initialStructureAnimationVisible: true
}
