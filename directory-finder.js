// var currentDirectory = 'Please show up on the Dashboard';
// // console.log('Hello from directory-finder! currentDirectory is ', currentDirectory); // this works
//
// export {currentDirectory}; // I also tried export var - no luck.

// export default function (x) {
//   return x * x * x;
// } // This is dumb, but it works. Why can't I export a simple variable?

export default function() {
  var currentDirectory = 'Please show up on the Dashboard';
  return currentDirectory;
}
