const paths        = require('./assets/gulp-config/paths');

const autoprefixer = require('autoprefixer');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const cssnano      = require('cssnano');
const del          = require('del');
const gulp         = require('gulp');
const gutil        = require('gulp-util');
const newer        = require('gulp-newer');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const postcss      = require('gulp-postcss');
const rename       = require('gulp-rename');
const run          = require('gulp-run');
const runSequence  = require('run-sequence');
const sass         = require('gulp-ruby-sass');
const uglify       = require('gulp-uglify-es').default;  // For es6 support
const sourcemaps   = require('gulp-sourcemaps');
const cssImporter  = require('node-sass-css-importer')({
    import_paths: paths.sassFiles
  });

// Include paths from the created paths.js file

// Process styles, add vendor-prefixes, minify, then
// output the file to the appropriate location
gulp.task('styles', function() {
    return sass(paths.sassFiles + '/paroparo.scss', {
      style: 'compressed',
      trace: true,
      loadPath: [paths.sassFiles]
    }).pipe(postcss([autoprefixer()]))
      .pipe(gulp.dest(paths.jekyllCssFiles))
      .pipe(gulp.dest(paths.siteCssFiles))
      .pipe(browserSync.stream())
      .on('error', gutil.log);
});

gulp.task('sass', function () {
    return gulp.src(paths.sassFiles)
      .pipe(sourcemaps.init())
      .pipe(sass({
        importer: [cssImporter]
      }).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.jekyllCssFiles))
      .pipe(gulp.dest(paths.siteCssFiles))
      .pipe(browserSync.stream())
      .on('error', gutil.log);
  });