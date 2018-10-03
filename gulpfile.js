const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require ('gulp-concat');

/* 
TOP LEVEL FUNCTIONS

gulp.task - define task
gulp.src - point to the src folder that contains the source code
gulp.build - point to the folder that will contain final build files
gulp.watch

*/

gulp.task('message', function(){
    return console.log('Gulp is running... \nTo build project, run command "gulp build"\n')
});
gulp.task('messageBuild', function(){
    return console.log('Project built...\nFinal product has been placed in the dist/ folder\n')
});

 //Takes all .html files and places them in the dist folder.
 gulp.task('copyHTML', function(){
     gulp.src('src/*.html')
     .pipe(gulp.dest('dist'));
 });


 //Minify JavaScript files

 gulp.task('minifyJS', function(){
    gulp.src('src/js/*.js')
    .pipe(uglify()).pipe(gulp.dest('dist/js'));
});

//Scripts
gulp.task('scripts', function(){
    gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
}); 

gulp.task('build', ['messageBuild','copyHTML', 'scripts'])