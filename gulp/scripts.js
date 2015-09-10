"use strict";

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var util = require('gulp-util');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('bundle', function () {
    var bundle = browserify({
        debug: false,
        extensions: ['.js', '.jsx'],
        entries: 'lib/main.js'
    });
    return bundle
        .transform(babelify)
        .bundle()
        .on("error", function (error) { util.log(util.colors.red(error.message)); })
        .pipe(source('mojito.js'))
        .pipe(gulp.dest('dist'))
        .pipe(size({title: "scripts"}));
});

gulp.task('uglify', ['bundle'], function () {
    return gulp.src('dist/mojito.js')
        .pipe(uglify({
            compress:  {
                unused: false,
                properties: false,
                side_effects: false
            },
            options: {
                mangle : false,
            }
        }))
        .on('error', function(error){
            console.log(error);
        })
        .pipe(rename('mojito.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(size({title: "scripts"}));
});

gulp.task('scripts', ['uglify']);
