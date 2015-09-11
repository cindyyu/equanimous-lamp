var gulp = require('gulp'),
    sass = require('gulp-sass'),
    riot = require('gulp-riot'),
    rev = require('gulp-rev'),
    livereload = require('gulp-livereload');
    browserSync = require('browser-sync').create();
    app = 'app/';
    flask = '../app/web/';

gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: "localhost:4000"
	});
});

gulp.task('riot', function() {
  gulp.src([app + 'scripts/**/*.tag', app + 'scripts/*.tag'])
    .pipe(riot())
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.dest(flask + 'static/js'))
	browserSync.reload();
});

gulp.task('scripts', function() {
  gulp.src([app + 'scripts/**/*.js', app + 'scripts/*.js'])
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.dest(flask + 'static/js'))
	browserSync.reload();
});

gulp.task('sass', function() {
  gulp.src(app + 'styles/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.dest(flask + 'static/css'))
    .pipe(livereload());
});

gulp.task('html', function() {
  gulp.src(app + 'index.html')
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest(flask + 'templates'))
	browserSync.reload();
});

gulp.task('default', ['browser-sync', 'riot', 'html', 'scripts'], function() {
  livereload.listen();
  gulp.watch(app + 'styles/**/*.scss', ['sass']);
  gulp.watch(app + 'scripts/**/*.tag', ['riot']);
  gulp.watch(app + 'scripts/**/*.js', ['scripts']);
  gulp.watch(app + 'index.html', ['html']);
});