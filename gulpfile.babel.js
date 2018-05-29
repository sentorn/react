const gulp = require('gulp')
    , plumber = require('gulp-plumber')
    , rename = require('gulp-rename')
    , autoprefixer = require('gulp-autoprefixer')
    , babel = require('gulp-babel')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , sass = require('gulp-sass')
    , browserSync = require('browser-sync')
    , pug = require('gulp-pug')
    , gulpImports = require('gulp-imports')
    , cleanCSS = require('gulp-clean-css')
    , $ = require('gulp-load-plugins')()
    , gcmq = require('gulp-group-css-media-queries');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('styles', function () {
    gulp.src(['src/styles/main.scss'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(gcmq())
        .pipe(autoprefixer())
        .pipe($.csscomb())
        .pipe(cleanCSS({
            format: 'beautify'
        }))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function () {
    return gulp.src('src/scripts/main.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(gulpImports())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('views', function buildHTML() {
    return gulp.src('src/templates/*.pug')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch("src/styles/**/*.scss", ['styles']);
    gulp.watch("src/scripts/**/*.js", ['scripts']);
    gulp.watch("src/templates/**/*.pug", ['views']);

    gulp.watch("dist/styles/*.css", ['bs-reload']);
    gulp.watch("dist/scripts/*.js", ['bs-reload']);
    gulp.watch("dist/*.html", ['bs-reload']);
});