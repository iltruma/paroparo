const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const cleanCSS     = require('gulp-clean-css');
const del          = require('del');
const gulp         = require('gulp');
const rename       = require('gulp-rename');
const run          = require('gulp-run');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const concatCss    = require('gulp-concat-css');
const merge        = require('merge2');

//Task che compila i file SASS, li unisce con le gli altri CSS (Leaflet, hightlight, ...) e li minimizza
gulp.task('style', function () {
  return merge(
      gulp.src("assets/sass/theme.scss")
      .pipe(sass({
          includePaths: ['assets/css'],
          onError: browserSync.notify
      })),
      gulp.src("assets/css/vendor/*.css")
    )
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(concat("paroparo.min.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('assets/css'));
});
