//Import dipendenze
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();
const gconcat      = require('gulp-concat');
const cleanCSS     = require('gulp-clean-css');
const gulp         = require('gulp');
const rename       = require('gulp-rename');
const run          = require('gulp-run-command').default;
const sass         = require('gulp-sass')(require('sass'));
const merge        = require('merge2');
const uglify       = require('gulp-uglify-es').default;
const imagemin     = require('gulp-imagemin');
const cache        = require('gulp-cache');
const size         = require('gulp-size');
const babel        = require('gulp-babel');
const yaml         = require('gulp-yaml');
const sassVars     = require('gulp-sass-vars');
const runSequence  = require('gulp4-run-sequence');
const fs           = require('fs');
const webp         = require('gulp-webp');
const fileClean    = require('gulp-clean');
const favicons     = require('gulp-favicons');
const argv         = require('yargs').argv;
const purgecss     = require('gulp-purgecss');

var site = "";
var colors = {};

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
      all: 'assets/css/**/*.css'
    },
    js: {
      root:'assets/js',
      all: 'assets/js/**/*.js'
    },
    img: {
      root: 'assets/img',
      all: ['assets/img/**/*.png', 'assets/img/**/*.jpg', '!assets/img/favicons/*'],
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

gulp.task('build:variables:create', function() {
  return gulp.src('./_config.yml')
  .pipe(yaml({ safe: true }))
  .pipe(rename({basename: 'site'}))
  .pipe(gulp.dest(paths.assets.json.root));
});

gulp.task('build:variables:set', function(callback) {
  site = JSON.parse(fs.readFileSync(paths.assets.json.root + "/site.json"));
  for (i in site.colors) {
    colors[Object.keys(site.colors[i])[0]] = Object.values(site.colors[i])[0];
  }
  callback();
});

gulp.task('build:styles:loader', function () {
  return gulp.src(paths._src.sass.app + "/loader.scss")
    .pipe(sassVars(colors))
    .pipe(sass.sync({
        quietDeps: true
      }))
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(gconcat("loader.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(size({title: "build:styles:loader"}))
    .pipe(gulp.dest(paths._site.assets.css))
    .pipe(gulp.dest("_includes/loader"));
});

gulp.task('build:styles:present', function () {
  return gulp.src(paths._src.sass.app + "/present.scss")
    .pipe(sassVars(colors))
    .pipe(sass.sync({
        quietDeps: true
      }))
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(gconcat("present.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(size({title: "build:styles:present"}))
    .pipe(gulp.dest(paths._site.assets.css))
    .pipe(gulp.dest("_includes/present"));
});


//Task che compila i file SASS, li unisce con le gli altri CSS dei vendor (Leaflet, hightlight, ...) e li minimizza nel file paroparo.min.css
gulp.task('build:styles:paroparo', function () {
  return merge(
      gulp.src(paths._src.sass.app + "/paroparo.scss")
      .pipe(sassVars(colors))
      .pipe(sass.sync({
          includePaths: [paths._src.sass.app],
          quietDeps: true
      }).on('error', sass.logError)),
      gulp.src(paths._src.css.vendor + "/*.css")
    ).pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(gconcat("paroparo.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(size({title: "build:styles:paroparo"}))
    .pipe(gulp.dest(paths._site.assets.css))
    .pipe(gulp.dest(paths.assets.css.root));
});

//Task che compila i file SASS, li unisce con le gli altri CSS dei vendor (Leaflet, hightlight, ...) e li minimizza nel file paroparo.min.css
gulp.task('build:styles:paroparo-dark', function () {
  return gulp.src(paths._src.sass.app + "/paroparo-dark.scss")
    .pipe(sassVars(colors))
    .pipe(sass.sync({
        quietDeps: true
      }
    ).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(gconcat("paroparo-dark.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(size({title: "build:styles:paroparo-dark"}))
    .pipe(gulp.dest(paths._site.assets.css))
    .pipe(gulp.dest(paths.assets.css.root));
});

gulp.task('build:styles:purge', function() {
  var content = paths._src.js.critical.concat(paths._src.js.optional)
  content = content.concat( paths._src.js.other)
  content = content.concat(paths.assets.html.all)
  return gulp.src(paths.assets.css.root + '/**/*.css')
      .pipe(purgecss({
          content: content,
          dynamicAttributes: ["data-color-scheme"],
          safelist: {
            greedy: [/(leaflet[-a-z]*)/, /(pageclip[-a-z]*)/, /(hljs[-a-z]*)/]
          } 
      }))
      .pipe(gulp.dest(paths._site.assets.css))
      .pipe(gulp.dest(paths.assets.css.root));
});

gulp.task('build:styles',  function(callback) {runSequence('build:variables:create', 'build:variables:set', ['build:styles:paroparo', 'build:styles:paroparo-dark', 'build:styles:loader', 'build:styles:present'], 'build:styles:purge', callback)});

//Task che compila i file JS
gulp.task('build:scripts:paroparo', function () {
  return gulp.src(paths._src.js.critical.concat(paths._src.js.optional))
    .pipe(babel({ 
      presets: [["@babel/preset-env", { modules: false }]],
      compact: false  }))
    .pipe(gconcat('paroparo.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({compress: {defaults: true}}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:scripts:paroparo"}))
    .pipe(gulp.dest(paths._site.assets.js))
    .pipe(gulp.dest(paths.assets.js.root));
});

//Task che compila i file JS che non servono sempre (es. leaflet, highlight)
gulp.task('build:scripts:other', function () {
  return gulp.src(paths._src.js.other)
    .pipe(babel({ 
      presets: [["@babel/preset-env", { modules: false }]],
      compact: false  }))
    .pipe(uglify({compress: {defaults: true}}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:scripts:other"}))
    .pipe(gulp.dest(paths._site.assets.js))
    .pipe(gulp.dest(paths.assets.js.root));
});

//Task che compila il per lo switch theme
gulp.task('build:scripts:switch', function () {
  return gulp.src(paths._src.js.app + '/switch.js' )
    .pipe(babel({ 
      presets: [["@babel/preset-env", { modules: false }]],
      compact: false  }))
    .pipe(gconcat('switch.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({compress: {defaults: true}}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:scripts:switch"}))
    .pipe(gulp.dest(paths._site.assets.js))
    .pipe(gulp.dest(paths.assets.js.root));
});

// Task che compila tutti i JS
gulp.task('build:scripts',  function(callback) {runSequence(['build:scripts:switch', 'build:scripts:paroparo', 'build:scripts:other'], callback)});

// Task di ottimizzazione delle immagini (sovrascrittura)
gulp.task('build:images', function () {
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
gulp.task('build:svg', function () {
  return gulp.src(paths.assets.img.svg)
  .pipe(browserSync.reload({stream: true}))
  .pipe(size({title: "build:svg"}))
  .pipe(gulp.dest(paths._site.assets.img))
  .pipe(gulp.dest(paths.assets.img.root));
});

//Task che genera le favicons
gulp.task('build:favicons', function () {
  return gulp.src(paths.assets.img.root + "/favicons/pp_logo.svg")
  .pipe(cache(favicons({
      appName: site.title,
      appShortName: site.title,
      appDescription: site.description,
      developerName: site.author,
      background: colors['primary-dark'],
      theme_color: colors['primary'],
      path: paths.assets.img.root + "/favicons/",
      url: site.url,
      lang: site.locale,
      display: "standalone",
      orientation: "any",
      scope: "/",
      start_url: "/",
      version: site.version,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        windows: false,
        yandex: false,
      },
      logging: false,
      pipeHTML: false,
      html: "",
      replace: false,
    }))
  )
  .pipe(gulp.dest(paths.assets.img.root + "/favicons/"));
});


// Task completo degli assets
gulp.task('build:assets',  function(callback) {runSequence('clean:jekyll', 'build:styles', 'build:scripts', 'build:images', 'build:svg', 'build:favicons', callback)});

// Task per il build Jekyll. Crea la cartella _site
gulp.task('build:jekyll', function(callback) {
  var env = (argv.env === undefined) ? 'dev' : argv.env ;
  if(env === 'prod') {
    run('jekyll build --config _config.yml --future --trace')();
  } else if (env === 'dev'){
    run('jekyll build --config _config.yml,_config_dev.yml --future --trace')();
  }
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
  gulp.watch(paths.assets.img.all, gulp.series('build:images'));
  //Watch html
  gulp.watch(paths.assets.html.all, gulp.series('build:jekyll:watch'));
  // Watch posts
  gulp.watch(paths._posts.root + '**/*.+(md|markdown|MD)', gulp.series('build:jekyll:watch'));
  // Watch data files
  //gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);
  callback();
}));

// Task watch per taggare l'immagine docker e fare pubblicarla su github

gulp.task('docker:deploy', function(callback) {
  var tag_deploy = (argv.tag_deploy === undefined) ? 'latest' : argv.tag_deploy ;
  run('docker build --pull --rm -f "Dockerfile" -t paroparo:' + tag_deploy + '"."')();
  run('docker tag paroparo docker.pkg.github.com/iltruma/paroparo/paroparo:' + tag_deploy)();
  run('docker push docker.pkg.github.com/iltruma/paroparo/paroparo:' + tag_deploy)();
  callback();
});

gulp.task('docker:build',  function(callback) {
  var tag_build = (argv.tag_build === undefined) ? 'latest' : argv.tag_build ;
  run('docker build --pull --rm -f "Dockerfile" -t paroparo:' + tag_build + '"."')();
  callback();
});