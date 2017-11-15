const gulp = require('gulp');
const ts = require('gulp-typescript');
const rimraf = require('rimraf');
const sourcemaps = require('gulp-sourcemaps');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

gulp.task('clean', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('scripts', ['clean'], () => {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watch', 'assets']);
gulp.task('build', ['scripts']);