//Import dipendenze
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const cleanCSS     = require('gulp-clean-css');
const del          = require('del');
const gulp         = require('gulp');
const rename       = require('gulp-rename');
const run          = require('gulp-run-command').default;
const sass         = require('gulp-sass');
const merge        = require('merge2');
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
const cache        = require('gulp-cache');
const size         = require('gulp-size');
const babel        = require('gulp-babel');
const yaml         = require('gulp-yaml');
const sassVars     = require('gulp-sass-vars');
const log          = require('fancy-log');
const runSequence  = require('gulp4-run-sequence');
const fs           = require('fs');
const prompt       = require('gulp-prompt');
const webp         = require('gulp-webp');
const fileClean    = require('gulp-clean');

// Lista delle path necesarie ai tasks
const paths = {
  here: './',
  _site: {
    root: '_site',
    assets: {
      root: '_site/assets',
      css: '_site/assets/css',
      js: '_site/assets/js',
      fonts: '_site/assets/fonts',
      img: '_site/assets/img',
      json: '_site/assets/json',
    }
  },
  _posts: {
    root: '_posts'
  },
  _src: {
    root: '_src',
    sass: {
      root: '_src/sass',
      all: '_src/sass/**/*',
      app: '_src/sass/app',
      vendor: '_src/sass/vendor'
    },
    css: {
      root:'_src/css',
      all: '_src/css/**/*',
      vendor: '_src/css/vendor'
    },
    js: {
      root:'_src/js',
      all: '_src/js/**/*',
      app: '_src/js/app',
      vendor: '_src/js/vendor',
      critical: ['_src/js/vendor/jquery.min.js', '_src/js/vendor/popper.min.js', '_src/js/vendor/bootstrap.js'],
      optional: ['_src/js/vendor/plugins/*.js', '_src/js/vendor/leap.min.js', '_src/js/app/custom.js'],
      other:    ['_src/js/vendor/plugins/other/*.js']
    }
  },
  assets: {
    root: 'assets',
    css: {
      root:'assets/css',
      all: 'assets/css/**/*'
    },
    js: {
      root:'assets/js',
      all: 'assets/js/**/*'
    },
    img: {
      root: 'assets/img',
      all: ['assets/img/**/*.png', 'assets/img/**/*.jpg'],
      svg: 'assets/img/**/*.svg'
    },
    fonts: {
      root: 'assets/fonts',
      all: 'assets/fonts/**/*'
    },
    html: {
      root: ['_layouts', '_includes'],
      all: ['_layouts/**/*.html', '_includes/**/*.html']
    },
    json: {
      root: 'assets/json',
      all: 'assets/json/**/*'
    }
  }
};

// Task che cancella la cartella _site
gulp.task('clean:jekyll', function(callback) {
  run('jekyll clean')();
  callback();
});

gulp.task('build:variables', function(callback) {
  return gulp.src('./_config.yml')
  .pipe(yaml({ safe: true }))
  .pipe(rename({basename: 'site'}))
  .pipe(gulp.dest(paths.assets.json.root));
});

//Task che compila i file SASS, li unisce con le gli altri CSS dei vendor (Leaflet, hightlight, ...) e li minimizza nel file paroparo.min.css
gulp.task('build:styles:loader', function () {
  var site = JSON.parse(fs.readFileSync(paths.assets.json.root + "/site.json"));
  var colors = {};
  for (i in site.colors) {
    colors[Object.keys(site.colors[i])[0]] = Object.values(site.colors[i])[0];
  }

  return gulp.src(paths._src.sass.app + "/loader.scss")
    .pipe(sassVars(colors))
    .pipe(sass({
        onError: browserSync.notify
      }))
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(concat("loader.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(size({title: "build:styles:loader"}))
    .pipe(gulp.dest(paths._site.assets.css))
    .pipe(gulp.dest(paths.assets.css.root));
});

//Task che compila i file SASS, li unisce con le gli altri CSS dei vendor (Leaflet, hightlight, ...) e li minimizza nel file paroparo.min.css
gulp.task('build:styles:paroparo', function () {
  var site = JSON.parse(fs.readFileSync(paths.assets.json.root + "/site.json"));
  var colors = {};
  for (i in site.colors) {
    colors[Object.keys(site.colors[i])[0]] = Object.values(site.colors[i])[0];
  }

  return merge(
      gulp.src(paths._src.sass.app + "/paroparo.scss")
      .pipe(sassVars(colors))
      .pipe(sass({
          includePaths: [paths._src.sass.app],
          onError: browserSync.notify
      })),
      gulp.src(paths._src.css.vendor + "/*.css")
    )
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(concat("paroparo.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(size({title: "build:styles:paroparo"}))
    .pipe(gulp.dest(paths._site.assets.css))
    .pipe(gulp.dest(paths.assets.css.root));
});

//Task che compila i file SASS, li unisce con le gli altri CSS dei vendor (Leaflet, hightlight, ...) e li minimizza nel file paroparo.min.css
gulp.task('build:styles:paroparo-dark', function () {
  var site = JSON.parse(fs.readFileSync(paths.assets.json.root + "/site.json"));
  var colors = {};
  for (i in site.colors) {
    colors[Object.keys(site.colors[i])[0]] = Object.values(site.colors[i])[0];
  }

  return gulp.src(paths._src.sass.app + "/paroparo-dark.scss")
    .pipe(sassVars(colors))
    .pipe(sass(
        {onError: browserSync.notify}
    ))
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(concat("paroparo-dark.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(size({title: "build:styles:paroparo-dark"}))
    .pipe(gulp.dest(paths._site.assets.css))
    .pipe(gulp.dest(paths.assets.css.root));
});

gulp.task('build:styles',  function(callback) {runSequence(['build:variables', 'build:styles:loader', 'build:styles:paroparo', 'build:styles:paroparo-dark'], callback)});

//Task che compila i file JS
gulp.task('build:scripts:paroparo', function() {
  return gulp.src(paths._src.js.critical.concat(paths._src.js.optional))
    .pipe(babel({ 
      presets: [["@babel/preset-env", { modules: false }]],
      compact: false  }))
    .pipe(concat('paroparo.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cache(uglify()))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:scripts:paroparo"}))
    .pipe(gulp.dest(paths._site.assets.js))
    .pipe(gulp.dest(paths.assets.js.root));
});

//Task che compila i file JS che non servono sempre (es. leaflet, highlight)
gulp.task('build:scripts:other', function() {
  return gulp.src(paths._src.js.other)
    .pipe(babel({ 
      presets: [["@babel/preset-env", { modules: false }]],
      compact: false  }))
    .pipe(cache(uglify()))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:scripts:other"}))
    .pipe(gulp.dest(paths._site.assets.js))
    .pipe(gulp.dest(paths.assets.js.root));
});

//Task che compila il per lo switch theme
gulp.task('build:scripts:switch', function() {
  return gulp.src(paths._src.js.app + '/switch.js' )
    .pipe(babel({ 
      presets: [["@babel/preset-env", { modules: false }]],
      compact: false  }))
    .pipe(concat('switch.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cache(uglify()))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:scripts:switch"}))
    .pipe(gulp.dest(paths._site.assets.js))
    .pipe(gulp.dest(paths.assets.js.root));
});

// Task che compila tutti i JS
gulp.task('build:scripts',  function(callback) {runSequence(['build:scripts:switch', 'build:scripts:paroparo', 'build:scripts:other'], callback)});

// Task di ottimizzazione delle immagini (sovrascrittura)
gulp.task('build:images', function() {
  return gulp.src(paths.assets.img.all)
  .pipe(fileClean({force: true}))
  .pipe(cache(imagemin({ optimizationLevel:5, progressive: true, interlaced: true })))
  .pipe(webp())
  .pipe(browserSync.reload({stream: true}))
  .pipe(size({title: "build:images"}))
  .pipe(gulp.dest(paths._site.assets.img))
  .pipe(gulp.dest(paths.assets.img.root));
});

// Task di ottimizzazione delle svg. E' sepratato dal task delle immagini perchè imagemin non ottimizza bene gli svg dei dividers e decorations (sovrascrittura)
gulp.task('build:svg', function() {
  return gulp.src(paths.assets.img.svg)
  .pipe(browserSync.reload({stream: true}))
  .pipe(size({title: "build:svg"}))
  .pipe(gulp.dest(paths._site.assets.img))
  .pipe(gulp.dest(paths.assets.img.root));
});

// Task completo degli assets
gulp.task('build:assets',  function(callback) {runSequence('clean:jekyll', 'build:styles', 'build:scripts', 'build:images', 'build:svg', callback)});

// Task per il build Jekyll. Crea la cartella _site
gulp.task('build:jekyll', function(callback) {
  run('jekyll build --config _config.yml --future --trace')();
  callback();
});

// Task watch per far ricompilare i file in _site
gulp.task('build:jekyll:watch', gulp.series('build:jekyll', function(callback) {
  browserSync.reload({stream: true});
  callback();
}));

// Build task completo (assets + jekyll)
gulp.task('build', function(callback) {runSequence('build:assets', 'build:jekyll', callback)});

// Task che fa il build e fa partire browsersync
gulp.task('serve', gulp.series('build', function(callback) {
  browserSync.init({
    server: {
      baseDir: paths._site.root
    },
    ui: {
      port: 3000
    },
    ghostMode: false, // Toggle to mirror clicks, reloads etc (performance)
    logFileChanges: true,
    open: true       // Toggle to auto-open page when starting
  });
  //Watch _config.yml
  gulp.watch(['_config.yml'], gulp.series('build:jekyll:watch'));
  // Watch css files and pipe changes to browserSync
  gulp.watch(paths._src.css.all, gulp.series('build:styles'));
  // Watch sass files and pipe changes to browserSync
  gulp.watch(paths._src.sass.all, gulp.series('build:styles'));
  // Watch .js files
  gulp.watch(paths._src.js.all, gulp.series('build:scripts'));
  // Watch image files and pipe changes to browserSync
  gulp.watch(paths._src.img.all, gulp.series('build:images'));
  //Watch html
  gulp.watch(paths.assets.html.all, gulp.series('build:jekyll:watch'));
  // Watch posts
  gulp.watch(paths._posts.root + '**/*.+(md|markdown|MD)', gulp.series('build:jekyll:watch'));
  // Watch data files
  //gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);
  callback();
}));

// Task watch per taggare l'immagine docker e fare pubblicarla su github
var tag_deploy, tag_build;
gulp.task('docker:deploy:input', function() {
  return gulp.src(paths.here)
  .pipe(prompt.prompt({
    type: 'input',
    name: 'tag',
    default: 'latest',
    message: 'Di quale tag vuoi fare il deploy?'
  }, (res) => {
    tag_deploy = res.tag;
  }))
});

gulp.task('docker:deploy', gulp.series('docker:deploy:input', function deploy(callback) {
  run('docker build --pull --rm -f "Dockerfile" -t paroparo:' + tag_deploy + '"."')();
  run('docker tag paroparo docker.pkg.github.com/iltruma/paroparo/paroparo:' + tag_deploy)();
  run('docker push docker.pkg.github.com/iltruma/paroparo/paroparo:' + tag_deploy)();
  callback();
}));

gulp.task('docker:build:input', function() {
  return gulp.src(paths.here)
  .pipe(prompt.prompt({
    type: 'input',
    name: 'tag',
    default: 'latest',
    message: 'Di quale tag vuoi fare il build?'
  }, (res) => {
    tag_build = res.tag;
  }))
});

gulp.task('docker:build', gulp.series('docker:build:input', function deploy(callback) {
  run('docker build --pull --rm -f "Dockerfile" -t paroparo:' + tag_build + '"."')();
  callback();
}));