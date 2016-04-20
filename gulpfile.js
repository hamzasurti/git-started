/* eslint-disable no-console */

const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const notify = require('gulp-notify');

function handleErrors(...args) {
  const argsCopy = Array.prototype.slice.call(args);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>',
  }).apply(this, argsCopy);
  this.emit('end'); // Keeps gulp from hanging on this task
}

function buildScript(file, watch) {
  const props = {
    entries: [`./components/ + ${file}`],
    debug: true,
    transform: babelify.configure({
      presets: ['react', 'es2015', 'stage-0'],
    }),
  };

  // Watchify if watch is set to true. Otherwise browserify once.
  const bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    const stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./build/'));
  }

  bundler.on('update', () => {
    const updateStart = Date.now();
    rebundle();
    console.log(`Updated! ${Date.now() - updateStart} ms`);
  });

  // Run it once the first time buildScript is called.
  return rebundle();
}

// Run once.
gulp.task('scripts', () => buildScript('Dashboard.js', false));

// Run 'scripts' task first, then watch for future changes.
gulp.task('default', ['scripts'], () => buildScript('Dashboard.js', true));
