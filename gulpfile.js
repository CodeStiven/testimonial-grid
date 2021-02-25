const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

// Sass taks
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

// Javascript Task

function jsTask() {
  return src("app/js/script.js", { sourcemaps: "." })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
}

// BrowsersyncTask

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task

function watchTask() {
  watch("dist/index.html", browsersyncReload);
  watch(
    ["app/scss/**/*.scss", "app/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}
// Default gulp task

exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
