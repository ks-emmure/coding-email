

var gulp    = require('gulp');
var gutil   = require('gulp-util');
var pug     = require('gulp-pug');
var changed = require('gulp-changed');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();


var compiled = {

  pug: [
    './dev/pug/**/*.pug',
    '!./dev/pug/mixins/*.pug'
  ],
  img: [
    './dev/img/**/*.jpg',
    './dev/img/**/*.gif',
    './dev/img/**/*.png'
  ]

}


gulp.task('pug', function(cb) {

  gulp.src(compiled.pug)
    .pipe(changed('./dist/', {extension: '.html'}))
    .pipe(pug({
      pretty: true
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('./dist/'))
    .on('end',function(){
      cb(null);
    });

});

gulp.task('img', function(cb) {

  gulp.src(compiled.img)
    .pipe(gulp.dest('./dist/img/'))

});

gulp.task('watch', function() {

  browserSync.init({
    open: false,
    proxy: "localhost:8888"
  });


  gulp.watch(compiled.pug, ['pug']);

  gulp.start('img');
  gulp.watch(compiled.img, ['img'])


  gulp.watch([

    './dist/**/*',

  ], function(event){
    console.log('[' + event.type +'] ' + event.path);
    browserSync.reload();
  });


});


gulp.task('server', function() {
  port = 8888;
  require('./server.js')(port);
});


gulp.task('build', function(callback) {
  gulp.start('img');
  runSequence(
    'pug',
    callback
  );
});




gulp.task('default', ['build'], function(){
  gulp.start('server');
  gulp.start('watch');
});
