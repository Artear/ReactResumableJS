var babel = require('gulp-babel');
var browserify = require('browserify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gulp = require('gulp');

gulp.task('source-js', function () {
    return gulp.src('./src/ReactResumableJs.js')
        .pipe(concat('react-resumable-js.js'))
        .pipe(babel({
            plugins: ['transform-object-assign'],
            presets: ['es2015', 'react','stage-0']
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('build', ['source-js']);