const project_folder = "dist";
const source_folder = "#src";
const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css",
    js: project_folder + "/js",
    img: project_folder + "/img/images",
    icons: project_folder + "/img/icons",
    fonts: project_folder + "/fonts",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/sass/styles.sass",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/images/**/*.{jpg,png,svg,gif,ico,webp}",
    icons: source_folder + "/img/icons/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
    templates: source_folder + "/templates/*.html",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/sass/styles.sass",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/images/**/*.{jpg,png,svg,gif,ico,webp}",
    icons: source_folder + "/img/icons/**/*.{jpg,png,svg,gif,ico,webp}",
    templates: source_folder + "/templates/*.html",
  },
  clean: "./" + project_folder + "/",
};

const { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  sass = require("gulp-sass")(require("sass")),
  autoprefixer = require("gulp-autoprefixer"),
  group_media = require("gulp-group-css-media-queries"),
  clean_css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  imagemin = require("gulp-imagemin"),
  // webp = require("gulp-webp"),
  // webp_html = require("gulp-webp-html"),
  // webp_css = require("gulp-webpcss"),
  { notify } = require("browser-sync");

function clean(params) {
  return del(path.clean);
}

function browserSync(params) {
  browsersync.init({
    server: { baseDir: "./" + project_folder + "/" },
    port: 3000,
    notify: false,
  });
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoplugins: [{ renoveViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function icons() {
  return src(path.src.icons)
    .pipe(
      imagemin({
        progressive: true,
        svgoplugins: [{ renoveViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.icons))
    .pipe(browsersync.stream());
}

function html() {
  return (
    src(path.src.html)
      .pipe(fileinclude())
      // .pipe(webp_html())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
  );
}

function css() {
  return src(path.src.css)
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(group_media())
    .pipe(
      autoprefixer({
        overrideBrowserlist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function watch_files(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.icons], icons);
}

const build = gulp.series(/*clean,*/ gulp.parallel(css, html));
const watch = gulp.parallel(build, watch_files, browserSync);

exports.icons = icons;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
