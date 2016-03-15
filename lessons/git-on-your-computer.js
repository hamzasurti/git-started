// Need to make sure all the tests here are valid.
// We may want to compare our tests to Git-It's.

// Button function template:
// buttonText: "I've committed - what's next?",
// // Check whether the user has git-committed new-file.text. Running git status should tell us what we need to know. We could also check for a message.
// buttonFunction: function() {
//
// 	var commandToRun = 'cd ' + currentDirectory// + '; git status';
// 	ipcRenderer.send('command-to-run', commandToRun);
// 	ipcRenderer.once('terminal-output', function(event, arg) {
// 		// Insert test
// 		ipcRenderer.send('test-result-1', false); // Replace false with Boolean
// 	})
// },
// errorMessage: "Oops! It looks like X IS WRONG, or you aren't inside the 'new-project' directory. Try again and then click the button above."

// Import React so we can use JSX.
import React from 'react';
// Why didn't I have to import ipcRenderer?

var currentDirectory = '~/Desktop';

// Export an array. Alternatively, we could use a linked list.
export default [
	{
		lessonText:
			<div>
				<h2>Welcome!</h2>
				<p>If you're learning to code, chances are you've heard about something called Git. Git can be intimidating for beginners - but it doesn't have to be!</p>
				<p>In this lesson, you'll...</p>
				<ul>
					<li>Set up Git</li>
					<li>Set up a project</li>
					<li>Learn some basic Git commands that you can use to track your new project</li>
					<li>Learn a bit about GitHub, a popular website that uses Git</li>
				</ul>
				<p>Don't worry - we'll walk you through each step. Ready to get started?</p>
			</div>,
		buttonText: "Yes - let's do this!"

	}, {
		lessonText:
			<div>
				<h2>Step 1: Set up Git</h2>
				<h3>Meet the terminal</h3>
				<p>For this step, we'll use the <strong>terminal</strong>, which lets you and your Mac communicate using just text.</p>
				<p>Software developers use their terminals every day, but no need to worry if this tool is new to you. We've embedded a terminal in this app to help you learn the ropes - it's the black box to the right.</p>
			</div>,
		buttonText: 'Got it!'

	}, {
		lessonText:
			<div>
				<h2>Step 1: Set up Git</h2>
				<h3>Check your version</h3>
				<p>To check whether your computer already has Git installed, type <code>git --version</code> and then click Enter.</p>
				<p>If you see a version number - like <code>git version 2.6.4</code> - you have Git installed, and you're ready for step two.</p>
				<p>If not, you can download Git from <a href='http://git-scm.com/downloads'>git-scm.com/downloads</a>. Then follow the directions at the top of this page to confirm that Git is installed correctly.</p>
			</div>,
		buttonText: "OK - I'm ready for step two!",
		buttonFunction: function() { // Check whether the user has installed Git
			// Send a command to the terminal via main.js.
			ipcRenderer.send('command-to-run', 'git --version');
			// Listen for the terminal's response.
			ipcRenderer.once('terminal-output', function(event, arg) {
				// Upon receiving the response, send a Boolean to main.js. If terminal-output contains the text 'git version', the user passed. If not, the user did not pass.
				ipcRenderer.send('test-result-1', arg.indexOf('git version') > -1);
			});
		},
		errorMessage: "Oops! It looks like you haven't installed Git. Try again and then click the button above."

	// I'll need to edit "you'll see"
	}, {
		lessonText:
			<div>
				<h2>Step 2: Set up a project</h2>
				<h3>Make a directory</h3>
				<p>OK, let's take a quick break from Git to set up our project.</p>
				<p>In the past, you've probably used the Finder or a program like Microsoft Word to create new folders and files. For this lesson, we'll use the terminal.</p>
				<p>Ready? Type <code>mkdir new-project</code> and then click Enter.</p>
				<p>Above the terminal, you'll see a visualization of what happens when you type this command.
				</p>
			</div>,
		buttonText: 'I typed, I saw, I conquered.',
		buttonFunction: function() { // Check whether the user has created new-project
			var commandToRun = 'cd ' + currentDirectory + '; cd new-project'; // If I'm doing this all the time, how can I make my code DRY?
			ipcRenderer.send('command-to-run', commandToRun); // need to replace '~/Desktop' with the user's current directory.
			ipcRenderer.once('terminal-output', function(event, arg) {
			// If we can't cd into new-project, the terminal will create an error, and arg will be a string starting with 'Error.' In this case, the user should fail the test, so we'll return a falsy value: zero. Otherwise, the user should pass.
				ipcRenderer.send('test-result-1', arg.indexOf('Error'));
			})
			// For testing only
			currentDirectory += '/new-project';
		},
		errorMessage: "Oops! It looks like you haven't created a new directory called 'new-project'. Try again and then click the button above."

	}, {
		lessonText:
			<div>
				<h2>Step 2: Set up a project</h2>
				<h3>Navigate to your new directory</h3>
				<p>As you just saw, you just created a new folder called "my-project." (The "mkdir" command is short for "make directory," and "directory" is just a fancy word for folder.)</p>
				<p>Now type <code>cd new-project</code> and click Enter to navigate to your new directory. (The "cd" command is short for "change directory.") This is where you'll  store all the files for your project.
				</p>
			</div>,
		buttonText: 'Got it!',
		// buttonFunction: function() {
		// 	// I want to see which directory the user is in. Simply running pwd won't work.
		// 	ipcRenderer.once('terminal-output', function(event, arg) {
		// 		console.log('result of pwd', arg);
		// 	})
		// },
		errorMessage: "Oops! It looks like you haven't navigated into the 'new-project' directory. Try again and then click the button above."

	}, {
		lessonText:
			<div>
				<h2>Step 2: Set up a project</h2>
				<h3>Create a file</h3>
				<p>Now let's add a file to your folder.</p>
				<p>In the terminal, type <code>touch new-file.txt</code> and click Enter.</p>
				<p>Notice that we haven't been typing the word "git" in the commands we're using to create directories and files and to navigate through them. That's because these commands aren't specific to Git - but we'll get back to Git now!</p>
			</div>,
		buttonText: "OK, I'm ready for step three!",
		buttonFunction: function() {
			// console.log('Check whether the user has created new-file.txt');
			var commandToRun = 'cd ' + currentDirectory + '; ls';
			ipcRenderer.send('command-to-run', commandToRun);
			ipcRenderer.once('terminal-output', function(event, arg) {
			// If the terminal-output contains 'new-file.txt', the user should pass.
				ipcRenderer.send('test-result-1', arg.indexOf('new-file.txt') > -1);
			})
		},
		errorMessage: "Oops! It looks like you haven't created a file called 'new-file.txt', or you aren't inside the 'new-project' directory. Try again and then click the button above."

	}, {
		lessonText:
			<div>
				<h2>Step 3: Learn Git commands</h2>
				<h3>git init</h3>
				<p>Now that we've created a project, we need to tell Git that we want to track it. To do this, type <code>git init</code> and then click Enter. This initializes a new Git repository, or "repo."</p>
			</div>,
		buttonText: "So what's a repo?",
		buttonFunction: function() {
			// Check whether the user has initialized their repo successfully
			var commandToRun = 'cd ' + currentDirectory + '; git status';
			ipcRenderer.send('command-to-run', commandToRun);
			ipcRenderer.once('terminal-output', function(event, arg) {
			// If the repo hasn't been initialized, the terminal will create an error, and arg will be a string starting with 'Error.' In this case, the user should fail the test, so we'll return a falsy value: zero. Otherwise, the user should pass.
				ipcRenderer.send('test-result-1', arg.indexOf('Error'));
			})
		},
		errorMessage: "Oops! It looks like you haven't initialized your repo, or you aren't inside the 'new-project' directory. Try again and then click the button above."

	}, {
		lessonText:
			<div>
				<h2>Step 3: Learn Git commands</h2>
				<h3>git status</h3>
				<p>A repo contains all the files Git is tracking for a project, as well as the revision history for these files. All this information is stored in a special folder called ".git" inside your project folder.</p>
				<p>Your .git folder is hidden by default, so you won't see it in your file tree. However, you can use the terminal to make sure you've initialized your repository correctly. Just  type <code>git status</code> and then click Enter. As long as you don't see this error message - <code>fatal: Not a git repository</code> - you're good to go.</p>
			</div>,
		buttonText: "I'm good to go!"

	}, {
		lessonText:
			<div>
				<h2>Step 3: Learn Git commands</h2>
				<h3>git add</h3>
				<p>So you've initialized a Git repository, and you've created the first file for your project. Now it's time to tell Git that you'd like to track that file.</p>
				<p>Type <code>git add new-file.txt</code> and click Enter to add this file to your "staging area." This tells Git that you want to track changes to new-file.txt, and that you're getting ready to make a commit.</p>
			</div>,
		buttonText: "So what's a commit?",
		buttonFunction: function() {
			// Check whether the user has git-added new-file.text
			var commandToRun = 'cd ' + currentDirectory + '; git status'; // same as the last test
			ipcRenderer.send('command-to-run', commandToRun);
			ipcRenderer.once('terminal-output', function(event, arg) {
				// If new-file.txt hasn't been added, arg will contain 'Untracked files' AND 'new-file.txt' will come after 'Untracked files'.
				var didUserPass = true;
				var indexOfUntrackedFiles = arg.indexOf('Untracked files');
				if (indexOfUntrackedFiles > -1) {
					if (arg.indexOf('new-file.txt') > indexOfUntrackedFiles) didUserPass = false;
				}
				ipcRenderer.send('test-result-1', didUserPass);
			})
		},
		errorMessage: "Oops! It looks like you haven't added new-file.txt to your staging area, or you aren't inside the 'new-project' directory. Try again and then click the button above."

	}, {
		lessonText:
			<div>
				<h2>Step 3: Learn Git commands</h2>
				<h3>git commit -m</h3>
				<p>You can think of a commit as a snapshot of your code at a specific point in time. Git saves each commit to your repo, along with a message you write to describe the status of the project.</p>
				<p>So let's commit - type <code>git commit -m "<strong>create file to store text for project</strong>"</code> and click Enter. (The "-m" is for "message," and you can replace the bolded text with whatever message you like.)</p>
				<p>It's a best practice to commit early and often, and to write descriptive commit messages. The more descriptive your commit messages are, the easier it will be to find specific commits when you want to refer back to them in the future!</p>
			</div>,
		buttonText: "I've committed - what's next?",
		//  Running git status should tell us what we need to know. We could also check for a message.
		buttonFunction: function() {
			// Check whether the user has git-committed new-file.text.
			var commandToRun = 'cd ' + currentDirectory + '; git log; git status'; // same as the last test. Or would running git log make more sense?
			ipcRenderer.send('command-to-run', commandToRun);
			ipcRenderer.once('terminal-output', function(event, arg) {
				// Insert test
				var didUserPass = true;
				// Check the git log to be sure there's a commit. We don't want arg to start with 'fatal' (which is probably an error).
				if (!arg.indexOf('fatal')) {
					didUserPass = false;
				// Then check the git status. If it contains 'Changes not staged for commit' or 'Changes to be committed', we don't want to see 'new-file.txt' after that. For now, though it's probably easier to check for 'nothing to commit, working directory clean';
				} else {
					if (arg.indexOf('nothing to commit, working directory clean') === -1) didUserPass = false;
				}
				ipcRenderer.send('test-result-1', didUserPass);
			})
		},
		errorMessage: "Oops! It looks like you have changes that you haven't committed, or you aren't inside the 'new-project' directory. Try again and then click the button above."

	}, {
		lessonText:
			<div>
				<h2>Step 3: Learn Git commands</h2>
				<h3>Take a break from Git to edit your file</h3>
				<p>OK, you've made a commit for this project - the first snapshot of many! But it wasn't a very exciting snapshot, because new-file.txt was empty. So let's add some text to the file and then commit again.</p>
				<p>Typically, developers write code using a text editor like Atom or Sublime Text. For this lesson, though, we'll practice editing a file directly from the terminal - something you can do even without Git.</p>
				<p>In the terminal, type <code>echo "<strong>This will be the best project ever.</strong>" > new-file.txt</code> and click Enter. (Again, you can replace the bolded part with whatever text you wish.)</p>
			</div>,
		buttonText: 'Done!',
		buttonFunction: function() {
			console.log('Check whether the user has edited new-file.text. Running git status should tell us what we need to know.');
		}

	}, {
		lessonText:
			<div>
				<h2>Step 3: Learn Git commands</h2>
				<h3>git diff</h3>
				<p>To make sure we actually edited the file, type <code>git diff</code> and click Enter.</p>
				<p>This will show us the differences between the current version of the project and our most recent commit. Remember: last time we committed, new-file.txt was empty.</p>
			</div>,
		buttonText: 'Great - I see the changes I made!',
		buttonFunction: function() {
			console.log('Can we check whether the user has run git diff?');
		}

	}, {
		lessonText:
			<div>
				<h2>Congrats!</h2>
				<p>You've finished our lesson on using Git on your computer.</p>
				<p>Now you're ready to start learning about GitHub, a popular website that makes it easy to back up your Git projects online and collaborate with other developers.</p>
			</div>,
		buttonText: 'Learn about Github'

	}, {
		lessonText:
			<div>
				<p>The GitHub lesson is coming soon, but it isn't ready yet. Would you like to repeat the lesson you just finished?</p>
			</div>,
		buttonText: "Let's do it!"
	}
];

// '" Stop the madness
