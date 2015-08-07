var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('test', function() {
    return gulp.src(['test/test-*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('chai').should()
            }
        }));
});

gulp.task('watch-tests', function() {
    gulp.watch(['lib/**', 'test/**'], ['test']);
});

gulp.task('default', ['test']);
