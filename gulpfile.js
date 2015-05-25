var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var harp        = require('harp');
var cp          = require('child_process');

/**
* Serve the Harp Site from the src directory
*/
  gulp.task('serve', function () {
    harp.server('./dist', {
      port: 9000
    }, function () {
      browserSync({
        proxy: "localhost:9000",
        open: false,
        /* Hide the notification. It gets annoying */
        notify: {
          styles: ['opacity: 0', 'position: absolute']
        }
      });
      /**
      * Watch for scss changes, tell BrowserSync to refresh main.css
      */
      gulp.watch("./src/**/*.scss", function () {
        cp.exec('harp compile . ../dist', {cwd: './src', stdio: 'inherit'}, function() {
          reload("main.css", {stream: true});
          console.log('Styles updated and refreshed.');
          });
      });
      /**
      * Watch for all other changes, reload the whole page
      */
      gulp.watch(["./src/**/*.ejs"], function () {
        cp.exec('harp compile . ../dist', {cwd: './src', stdio: 'inherit'}, function() {
          reload();
        });
      });
    })
  });

/**
* Build the Harp Site
*/
  gulp.task('build', function (done) {
    cp.exec('harp compile . ../dist', {cwd: './src', stdio: 'inherit'});
  });

/**
* Default task, running `gulp` will build the Harp site,
* launch BrowserSync & watch files.
*/
  gulp.task('default', ['build', 'serve']);