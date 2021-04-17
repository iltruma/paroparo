//Import dipendenze
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();
const reload       = browserSync.reload;
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
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
const cache        = require('gulp-cache');

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
    .pipe(reload({stream: true}))
});

// Task di ottimizzazione delle immagini
gulp.task('build:images', function() {
  return gulp.src('_assets/img/**/*')
  .pipe(cache(imagemin({ optimizationLevel:5, progressive: true, interlaced: true })))
  .pipe(gulp.dest('public/img'))
  .pipe(reload({stream: true}))
});

gulp.task('build:assets',  gulp.series('build:styles', 'build:scripts', 'build:fonts', 'build:images'));

// Run jekyll build command
gulp.task('build:jekyll', function() {
  return gulp.src('.')
  .pipe(run('jekyll build --config _config.yml'))
});

// Special tasks for building and reloading BrowserSync
gulp.task('build:jekyll:watch', gulp.series('build:jekyll', function(callback) {
  reload();
  callback();
}));

// Build site
gulp.task('build', gulp.series('build:assets', 'build:jekyll'));

// Delete the entire _site directory
gulp.task('clean:jekyll', function(callback) {
  del(['_site']);
  callback();
});

// Serve site and watch files
gulp.task('serve', gulp.series('build', function() {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    ghostMode: false, // Toggle to mirror clicks, reloads etc (performance)
    logFileChanges: true,
    logLevel: 'debug',
    open: true       // Toggle to auto-open page when starting
  });
  //Watch _config.yml
  gulp.watch(['_config.yml'], gulp.series('build:jekyll:watch'));
  // Watch css files and pipe changes to browserSync
  gulp.watch('_assets/css/**/*', gulp.series('build:styles'));
  // Watch sass files and pipe changes to browserSync
  gulp.watch('_assets/sass/**/*', gulp.series('build:styles'));
  // Watch .js files
  gulp.watch('_assets/js/**/*', gulp.series('build:scripts'));
  // Watch image files and pipe changes to browserSync
  gulp.watch('_assets/img/**/*', gulp.series('build:images'));
  // Watch posts
  gulp.watch('_posts/**/*.+(md|markdown|MD)', gulp.series('build:jekyll:watch'));
  // Watch data files
  //gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);
}));