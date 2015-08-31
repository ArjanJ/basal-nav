var gulp            = require('gulp');
var sass            = require('gulp-sass');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var uglify          = require('gulp-uglify');
var rename 					= require('gulp-rename');
var autoprefixer    = require('autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var postcss         = require('gulp-postcss');

var paths = {
	src: {
		basalNav: './src/js/basalNav.js',
		js: './src/js',
		scss: './src/scss/*.scss'
	},

	dist: {
		js: './dist/js/',
		css: './dist/css'
	}
};

gulp.task('scss', function() {
	return gulp.src(paths.src.scss)
		.pipe(sass())
		.on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
		.pipe(postcss([
		  autoprefixer()
		]))
		.pipe(minifyCSS())
		.pipe(gulp.dest(paths.dist.css));
});

gulp.task('minify', function() {

	return gulp.src(paths.src.basalNav)
		.pipe(uglify())
		.pipe(rename('basalNav.min.js'))
		.pipe(gulp.dest(paths.dist.js));
});

gulp.task('browserify', function() {

  return browserify(paths.src.basalNav)
    .bundle()
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.src.js));
});

gulp.task('watch', function() {
	gulp.watch(paths.src.basalNav, ['minify', 'browserify']);
	gulp.watch(paths.src.scss, ['scss']);
});

gulp.task('default', ['watch', 'minify', 'browserify', 'scss']);