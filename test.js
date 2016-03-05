console.log('test.js is running');

const exec = require('child_process').exec;
console.log(exec);

// exec('git --version', function(err, stdout, stderr) {
// 	console.log('err is', err); // null
// 	console.log('stdout is', stdout); // git version 2.6.4
// 	console.log('stderr is', stderr); // ''
// });

exec('git --version', (err, stdout) => {
	if (err) throw err;
	console.log(stdout);
});

// exec('pwd', function(err, stdout, stderr) {
// 	if (err) return console.log(err);
// 	console.log(/*'stdout is', */stdout);
// });

// exec('atom .', function(err, stdout, stderr) {
// 	if (err) throw err; // not 'return throw'
// 	// if (err) return console.log('err', err);
// 	console.log(/*'stdout is', */stdout);
// });

// console.log('at the end of test.js'); // I see this console.log before I see the console.logs above. Why? Asyrchonicity!