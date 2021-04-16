//Import dipendenze
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const cleanCSS     = require('gulp-clean-css');
const del          = require('del');
const gulp         = require('gulp');
const reload       = browserSync.reload;
const rename       = require('gulp-rename');
const run          = require('gulp-run');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const concatCss    = require('gulp-concat-css');
const merge        = require('merge2');
const uglify       = require('gulp-uglify');

//Task che compila i file SASS, li unisce con le gli altri CSS dei vendor (Leaflet, hightlight, ...) e li minimizza nel file paroparo.min.css
gulp.task('build:styles', function () {
  return merge(
      gulp.src("_assets/sass/app/leap.scss")
      .pipe(sass({
          includePaths: ['_assets/sass/app'],
          onError: browserSync.notify
      })),
      gulp.src("_assets/css/vendor/*.css")
    )
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(concat("paroparo.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('public/css'));
});

//Task che compila i file JS critici (Bootstrap, Popper e Jquery)
gulp.task('build:scripts:critical', function() {
  return gulp.src(['_assets/js/vendor/critical/jquery.min.js', '_assets/js/vendor/critical/popper.min.js', '_assets/js/vendor/critical/bootstrap.js'])
    .pipe(concat('paroparo-critical.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('public/js'))
});

//Task che compila i file JS opzionali e quelli custom del sito
gulp.task('build:scripts:optional', function() {
  return gulp.src(['_assets/js/vendor/plugins/*.js', '_assets/js/vendor/leap.min.js', '_assets/js/app/custom.js'])
    .pipe(concat('paroparo.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('public/js'))
});

// Task che compila tutti i JS
gulp.task('build:scripts',  gulp.series('build:scripts:critical', 'build:scripts:optional'));

// Place fonts in proper location
gulp.task('build:fonts', function() {
  return gulp.src('_assets/fonts/*')
    .pipe(gulp.dest('public/fonts'))
    .pipe(browserSync.stream())
});

// gulp.task('images', function() {
//   return gulp.src('_assets/src/img/**/*')
//   .pipe(cache(imagemin({ optimizationLevel:5, progressive: true, interlaced: true })))
//   .pipe(gulp.dest('_assets/dist/img'));
// });

gulp.task('build',  gulp.series('build:styles', 'build:scripts', 'build:fonts'));
