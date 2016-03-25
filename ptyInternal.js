const pty = require('pty.js');
const animationDataSchema = require('./AnimationData/StructureSchema')

var currDir;
	var ptyTerm = pty.fork('bash', [], {
		name: 'xterm-color',
		cols: 100,
		rows: 100,
		cwd: process.env.HOME,
		env: process.env
	});

  // sets the terminal prompt to pwd
ptyTerm.write(`PROMPT_COMMAND='PS1=$(pwd)" $ "'\r`)
    process.on('message', function(data) {
			data.message.cols ? ptyTerm.resize(data.message.cols,data.message.rows) :ptyTerm.write(data.message)
    });

    ptyTerm.on('data', function(data) {
      // crude way to find path, need to improve
      process.send({
        data:data
      })

      var re = /\s[$]\s/g;
			// var re;
      if (data.match(re)) {
				console.log(data);
        var temp = data;
        temp = temp.replace(re,'');
        currDir = temp;
        animationDataSchema.DataSchema(currDir);
      }
    });
