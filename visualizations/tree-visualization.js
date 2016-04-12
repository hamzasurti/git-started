const d3 = require('d3');
import linkVisualization from './link-visualization';

var treeVisualization = {};

treeVisualization.duration = linkVisualization.duration;

// Set the attributes for nodes that are new to the DOM, including placing them in their initial position (x0, y0).
treeVisualization.enter = (selection, duration) =>{
  // Translate this node d.y0 units right and d.x0 units down.
  selection.attr("transform", function(d) {
              return "translate(" + d.y0 + "," + d.x0 + ")";
            })

  selection.select("image")
           .on('click', function(d){
             if(d.type){
               const commandString = `cd ${d.name.replace(/ /g, "\\ ")} \n\r`
               ipcRenderer.send('command-message', commandString);
             }
             if(d.value || d.children){
               const commandString = `cd .. \n\r`
               ipcRenderer.send('command-message', commandString);
             }
           })

  // selection.select("text")
  //   .style("fill-opacity", 1e-6);

  treeVisualization.update(selection, duration);
}

// Transition new and updated nodes to their new position
treeVisualization.update = (selection, duration) => {

  var transition = selection.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    })

    // fix the x,y,width, height to scale properly
    // y must always be half of height
  const scale = 16;

  transition.select("image")
    .attr("xlink:href", function(d) {return d.icon;})
    .attr("x", function(d) {return d.position_x ? d.position_x : 0})
    .attr("y", function(d) {return d.position_y ? d.position_y : scale * -(1/2)})
    .attr("width", function(d) {return d.value ? d.value : scale})
    .attr("height", function(d) {return d.value ? d.value : scale})

  transition.select("text")
    .attr("x", function(d) { return d.value ? -9 : 17})
    .attr("y", function(d) { if(d.value) return 25;})
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill-opacity", 1)
    .style("font-size", function(d) {return d.value ? 10 : 7})
    .text(function(d) { return d.name; })
    // .attr("text-anchor", function(d) { return d.children || d.childrenHidden ? "end" : "start"; })

}

export default treeVisualization;
