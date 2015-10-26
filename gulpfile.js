var gulp            = require('gulp');
var sass            = require('gulp-sass');
var uglify          = require('gulp-uglify');
var rename 					= require('gulp-rename');
var autoprefixer    = require('autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var postcss         = require('gulp-postcss');
var concat					= require('gulp-concat');

var paths = {
	src: {
		js: {
			all: './src/js/*.js',
			basalNav: './src/js/bassNav.js'
		},
		scss: {
			all: './src/scss/**/*.scss'
		}
	},

	dist: {
		js: './dist/js/',
		css: './dist/css'
	}
};

gulp.task('scss', function() {
	return gulp.src(paths.src.scss.all)
		.pipe(sass())
		.on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(minifyCSS())
		.pipe(rename('bassNav.min.css'))
		.pipe(gulp.dest(paths.dist.css));
});

gulp.task('js', function() {
	return gulp.src(paths.src.js.basalNav)
		.on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest(paths.dist.js))
		.pipe(uglify())
		.pipe(rename('bassNav.min.js'))
		.pipe(gulp.dest(paths.dist.js));
});


gulp.task('watch', function() {
	gulp.watch(paths.src.js.all, ['js']);
	gulp.watch(paths.src.scss.all, ['scss']);
});

gulp.task('default', ['watch', 'js', 'scss']);