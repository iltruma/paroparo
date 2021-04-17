//Import dipendenze
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
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
const cache        = require('gulp-cache');
const size         = require('gulp-size');
const babel        = require('gulp-babel');

// Lista delle path necesarie ai tasks
var paths = {
  here: './',
  _site: {
    root: '_site'
  },
  _posts: {
    root: '_posts'
  },
  public: {
    root: 'public'
  },
  _assets: {
    root: '_assets',
    sass: {
      root: '_assets/sass',
      all: '_assets/sass/**/*',
      app: '_assets/sass/app',
      vendor: '_assets/sass/vendor',
      output: 'public/css'
    },
    css: {
      root:'_assets/css',
      all: '_assets/css/**/*',
      vendor: '_assets/css/vendor',
      output: 'public/css'
    },
    js: {
      root:'_assets/js',
      all: '_assets/js/**/*',
      app: '_assets/js/app',
      vendor: '_assets/js/vendor',
      critical: ['_assets/js/vendor/critical/jquery.min.js', '_assets/js/vendor/critical/popper.min.js', '_assets/js/vendor/critical/bootstrap.js'],
      optional: ['_assets/js/vendor/plugins/*.js', '_assets/js/vendor/leap.min.js', '_assets/js/app/custom.js'],
      output: 'public/js'
    },
    img: {
      root: '_assets/img',
      all: '_assets/img/**/*',
      output: 'public/img'
    },
    fonts: {
      root: '_assets/fonts',
      all: '_assets/fonts/**/*',
      output: 'public/fonts'
    },
    html: {
      _layouts: {
        root: '_layouts',
        all: '_layouts/**/*.html'
      },
      _includes: {
        root: '_includes',
        all: '_includes/**/*.html'
      }
    }
  }
};

// Task che cancella la cartella _site
gulp.task('clean:jekyll', function(callback) {
  del([paths._site.root]);
  callback();
});

// Task che cancella la cartella public
gulp.task('clean:assets', function(callback) {
  del([paths.public.root]);
  callback();
});

gulp.task('clean',  gulp.series('clean:jekyll', 'clean:assets'));

//Task che compila i file SASS, li unisce con le gli altri CSS dei vendor (Leaflet, hightlight, ...) e li minimizza nel file paroparo.min.css
gulp.task('build:styles', function () {
  return merge(
      gulp.src(paths._assets.sass.app + "/leap.scss")
      .pipe(sass({
          includePaths: [paths._assets.sass.app],
          onError: browserSync.notify
      })),
      gulp.src(paths._assets.css.vendor + "/*.css")
    )
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(concat("paroparo.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(browserSync.stream())
    .pipe(size())
    .pipe(gulp.dest(paths._assets.sass.output));
});

//Task che compila i file JS critici (Bootstrap, Popper e Jquery)
gulp.task('build:scripts:critical', function() {
  return gulp.src(paths._assets.js.critical)
    .pipe(sourcemaps.init())
    .pipe(concat('paroparo-critical.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size())
    .pipe(gulp.dest(paths._assets.js.output))
});

//Task che compila i file JS opzionali e quelli custom del sito
gulp.task('build:scripts:optional', function() {
  return gulp.src(paths._assets.js.optional)
    .pipe(sourcemaps.init())
    .pipe(concat('paroparo.js'))
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size())
    .pipe(gulp.dest(paths._assets.js.output))
});

// Task che compila tutti i JS
gulp.task('build:scripts',  gulp.series('build:scripts:critical', 'build:scripts:optional'));

// Task che copia i font in public
gulp.task('build:fonts', function() {
  return gulp.src(paths._assets.fonts.all)
    .pipe(size())
    .pipe(gulp.dest(paths._assets.fonts.output))
    .pipe(browserSync.reload({stream: true}))
});

// Task di ottimizzazione delle immagini
gulp.task('build:images', function() {
  return gulp.src(paths._assets.img.all)
  .pipe(cache(imagemin({ optimizationLevel:5, progressive: true, interlaced: true })))
  .pipe(size())
  .pipe(gulp.dest(paths._assets.img.output))
  .pipe(browserSync.reload({stream: true}))
});

// Task completo degli assets
gulp.task('build:assets',  gulp.series('clean', 'build:styles', 'build:scripts', 'build:fonts', 'build:images'));

// Task per il build Jekyll. Crea la cartella _site
gulp.task('build:jekyll', function() {
  return gulp.src(paths.here)
  .pipe(run('jekyll build --config _config.yml'))
});

// Task watch per far ricompilare i file in _site
gulp.task('build:jekyll:watch', gulp.series('build:jekyll', function(callback) {
  browserSync.reload({stream: true});
  callback();
}));

// Build task completo (assets + jekyll)
gulp.task('build', gulp.series('build:assets', 'build:jekyll'));

// Task che fa il build e fa partire browsersync
gulp.task('serve', gulp.series('build', function() {
  browserSync.init({
    server: {
      baseDir: paths._site.root
    },
    ghostMode: false, // Toggle to mirror clicks, reloads etc (performance)
    logFileChanges: true,
    open: true       // Toggle to auto-open page when starting
  });
  //Watch _config.yml
  gulp.watch(['_config.yml'], gulp.series('build:jekyll:watch'));
  // Watch css files and pipe changes to browserSync
  gulp.watch(paths._assets.css.all, gulp.series('build:styles'));
  // Watch sass files and pipe changes to browserSync
  gulp.watch(paths._assets.sass.all, gulp.series('build:styles'));
  // Watch .js files
  gulp.watch(paths._assets.js.all, gulp.series('build:scripts'));
  // Watch image files and pipe changes to browserSync
  gulp.watch(paths._assets.img.all, gulp.series('build:images'));
  // Watch posts
  gulp.watch(paths._posts.root + '**/*.+(md|markdown|MD)', gulp.series('build:jekyll:watch'));
  // Watch data files
  //gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);
}));