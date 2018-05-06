
var gulp       = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    notify       = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    smartgrid = require('smart-grid'),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    gcmq = require('gulp-group-css-media-queries'),
    nunjucks = require('nunjucks'),
    gulpSassError = require('gulp-sass-error');
    

    
gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.scss') // Берем источник
        .pipe(
            plumber( {
                errorHandler: function ( error ) {
                    console.log('=================ERROR=================');
                    console.log(error.message);
                    notify('ERROR Епта бля')
                    this.emit( 'end' );
                }
            })
        )
        .pipe(sourcemaps.write())
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gcmq())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'node_modules/slick-carousel/slick/slick.min.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/nunjucks/browser/nunjucks.min.js'// шаблонизатор
     
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});


gulp.task('css-main', ['sass'], function() {
    return gulp.src('app/css/main.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
}); 



gulp.task('html', function () {
    gulp.src('app/html_includes/*.html') //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest('app')) //Выплюнем их в папку build
});



gulp.task('watch', ['browser-sync', 'css-main', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
   
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // С кешированием
        // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'sass', 'css-main', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/main.min.css',
        'app/css/libs.min.css',
        'app/css/font.css',
        'app/css/font-awesome.css',
        'app/css/lineicons.css',
        'app/css/normalize.css',
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});


settings = {
outputStyle: 'scss', /* less || scss || sass || styl */
columns: 12, /* number of grid columns */
offset: "30px", /* gutter width px || % */
container: {
maxWidth: '1230px', /* max-width оn very large screen */
fields: '30px' /* side fields */
},
breakPoints: {
lg: {
'width': '1170px', /* -> @media (max-width: 1100px) */
'fields': '30px' /* side fields */
},
md: {
'width': '992px',
'fields': '15px'
},
sm: {
'width': '768px',
'fields': '15px'
},
xs: {
'width': '576px',
'fields': '15px'
}
}
};

gulp.task('smartgrid', function() {
smartgrid('app/sass', settings);
});

gulp.task('clear', function (callback) {
    return cache.clearAll();
})



gulp.task('default', ['watch']);
