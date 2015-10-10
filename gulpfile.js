var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify')
var notifier = require('node-notifier');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync')

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }
  console.log(title);
  console.log(message);
  notifier.notify({title: title, message: message});
};


var bundler = watchify(browserify({
  entries: ['./src/app.jsx'],
  transform: [babelify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

function bundle() {
  return bundler.bundle()
    .on('error', notify)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
}

bundler.on('update', bundle);
gulp.task('js', function() { bundle(); });


gulp.task('serve', function() {
    browserSync({
        server: "./dist",
        open: true,
        notify: false
    });
});

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('copy', function () {
  gulp.src(['index.html','fonts/**/*'],{base:'./'})
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['js', 'copy', 'serve', 'sass', 'watch']);

gulp.task('watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
