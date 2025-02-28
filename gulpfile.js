var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

gulp.task('deploy', function () {
    let conn = ftp.create({
        host: "100.64.0.3",
        port: 5021,
        user: "WDeployAdmin",
        password: 'Sosd2013',
        parallel: 10,
        log: gutil.log
    })
    let globs = [
        'dist/**'
    ]
    return gulp.src(globs, { base: './dist', buffer: false })
        .pipe(conn.dest('/'))
})