var gulp = require('gulp')
    , sass = require('gulp-sass')
    , minify = require('gulp-minify-css')
    , rename = require('gulp-rename')
    , base64 = require('gulp-base64')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , fileinclude = require('gulp-file-include')
    , del = require('del')
    , serve = require('gulp-serve')
    , jshint = require('gulp-jshint')
    , jscs = require('gulp-jscs');


gulp.task('serve', serve('Dist'));

var base = ".";

//Paths configuration
var config = {
    "src": {
        "sass": [base + "/Source/css/app.scss"],
        "js": [base + "/Source/js/lib/jquery-1.11.2/*.js",
              base + "/Source/js/lib/bootstrap-3.3.2/*.js",
              base + "/Source/js/lib/bootstrap-3.3.2/**/*.js",
              base + "/Source/js/lib/**/*.js",
              base + "/Source/js/app/**/*.js",
              ],
        "allJS" : [base + "/Source/js/**/*.*"],
        "images" : [ base + "/Source/images/**/*.*", base + "/Source/*.png" ],
        "fonts" : [base + "/Source/fonts/**/*.*"],
        "html" : [base + "/Source/*.html"],
        "misc" : [base + "/Source/*.png", base + "/Source/robots.txt", base + "/Source/*.ico", base + "/Source/*.xml"]
    },
    "dest" : {
        "css" : base + "/Dist/css",
        "js": base + "/Dist/js",
        "images" : base + "/Dist/images",
        "fonts" : base + "/Dist/fonts",
        "html" : base + "/Dist",
        "server" : base + "/Dist",
        "root" : base + "/Dist"
    }
};


gulp.task('sass', function () {
    return gulp.src(config.src.sass)
        .pipe(sass({ sourcemap: true }))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('compile-html', function(){
  return gulp.src(config.src.html)
    .pipe(fileinclude({
      prefix : '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.dest.html));
});

gulp.task('js', ['copy-js'], function () {
    return gulp.src(config.src.js)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.dest.js));
});

gulp.task('copy-js', function(){
  return gulp.src(config.src.allJS)
    .pipe(gulp.dest(config.dest.js));
});

gulp.task('minify-css', ['sass'], function(){
    return gulp.src([config.dest.css + '/app.css'])
        .pipe(base64({
          baseDir : config.dest.root
          }))
        .pipe(minify({ keepBreaks : true }))
        .pipe(rename({ suffix : '.min' }))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('copy-images', function(){
  return gulp.src(config.src.images)
  .pipe(gulp.dest(config.dest.images))
});

gulp.task('copy-fonts', function(){
  return gulp.src(config.src.fonts)
    .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy-misc', function(){
  return gulp.src(config.src.misc)
    .pipe(gulp.dest(config.dest.server));
});


gulp.task('clean', function(callback){
  del(config.dest.root, callback)
});

gulp.task('build', ['minify-css','compile-html', 'copy-images', 'copy-fonts', 'copy-misc', 'js'], function () { });


gulp.task('server', function(){
  gulp.src(config.dest.server)
    .pipe(webserver({
      port: 3000,
      livereload : false,
      directoryListing : true,
      open : true,
      fallback : 'index.html'
    }));
});

gulp.task('watch', function () {
    gulp.watch(config.src.html, ['compile-html']);
    gulp.watch(config.src.css, ['build']);
    gulp.watch(config.src.js, ['copy-js']);
    gulp.watch(config.src.images, ['copy-images']);
    gulp.watch(config.src.fonts, ['copy-fonts']);

});

gulp.task('default', ['build', 'serve', 'watch'], function () { });
