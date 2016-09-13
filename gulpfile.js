/**
 * Created by davidhradek on 13.09.16.
 */

const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const embedTemplates = require('gulp-angular-embed-templates');
const SystemBuilder = require('systemjs-builder');
const fs = require('fs');

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile-ts', ['clean'], function () {
    return gulp
        .src('app/**/*.ts')
        .pipe(embedTemplates({basePath: __dirname})) // inline templates
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist/app'));
});

gulp.task('systemjs-bundle', ['compile-ts'],  function () {

    var file = fs.readFileSync('systemjs.config.js', 'utf8');
    var jsonInner = file.substring(file.indexOf("System.config({")+14, file.indexOf("});")+1);
    jsonInner = jsonInner.replace("\"./app\"", "\"./dist/app\"");
    eval("var sysjsConf = "+jsonInner);

    // Copy config from systemjs.config.js .. but changed
    var builder = new SystemBuilder('', sysjsConf);

    return builder.buildStatic('app/main.js', 'dist/app.js');
});

// clean the contents of the distribution directory
gulp.task('clean-app', ['systemjs-bundle'], function () {
    return del('dist/app');
});

gulp.task('copy-assets', ['clean-app'], function() {
    return gulp.src(['assets/**/*'], { base : './' })
        .pipe(gulp.dest('dist'))
});

gulp.task('copy-modules', ['copy-assets'], function() {
    // all javascripts folders included from index
    return gulp.src([
        'node_modules/es6-shim/**/*',
        'node_modules/zone.js/dist/**/*',
        'node_modules/reflect-metadata/**/*',
        'node_modules/systemjs/dist/**/*',
        'node_modules/jquery/dist/**/*',
        'node_modules/jqueryui/**/*',
        'node_modules/jquery-knob/dist/**/*',
        'node_modules/autolayout/dist/**/*',
        'node_modules/blocko/examples/angular2/js/**/*'
    ], { base : './' })
        .pipe(gulp.dest('dist'))
});

gulp.task('copy-index', ['copy-modules'], function() {
    return gulp.src(['index.dist.html','favicon.png', 'systemjs.config.js'], { base : './' })
        .pipe(gulp.dest('dist'))
});

gulp.task('build', ['copy-index']);
gulp.task('default', ['build']);