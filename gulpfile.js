var gulp            = require('gulp');
var sass            = require('gulp-sass');
var uglify          = require('gulp-uglify');
var rename 					= require('gulp-rename');
var autoprefixer    = require('autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var postcss         = require('gulp-postcss');

var paths = {
	src: {
		basalNav: './src/js/basalNav.js',
		js: './src/js',
		scss: {
			all: './src/scss/**/*.scss',
			demo: './src/scss/demo/*.scss',
			basalNav: './src/scss/basalNav/*.scss'
		}
	},

	dist: {
		js: './dist/js/',
		css: './dist/css'
	}
};

function scssDemo() {
	return gulp.src(paths.src.scss.demo)
		.pipe(sass())
		.on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
		.pipe(postcss([
		  autoprefixer()
		]))
		.pipe(minifyCSS())
		.pipe(rename('demo.css'))
		.pipe(gulp.dest(paths.dist.css));
}

function scssBasalNav() {
	return gulp.src(paths.src.scss.basalNav)
		.pipe(sass())
		.on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
		.pipe(postcss([
		  autoprefixer()
		]))
		.pipe(minifyCSS())
		.pipe(rename('basalNav.min.css'))
		.pipe(gulp.dest(paths.dist.css));
}

gulp.task('scssDemo', scssDemo);
gulp.task('scssBasalNav', scssBasalNav);

gulp.task('js', function() {
	return gulp.src(paths.src.basalNav)
		.pipe(uglify())
		.pipe(rename('basalNav.min.js'))
		.pipe(gulp.dest(paths.dist.js));
});


gulp.task('watch', function() {
	gulp.watch(paths.src.basalNav, ['js']);
	gulp.watch(paths.src.scss.all, ['scssDemo', 'scssBasalNav']);
});

gulp.task('default', ['watch', 'js', 'scssDemo', 'scssBasalNav']);