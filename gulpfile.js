import { src, dest, watch, series, parallel } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import terser from 'gulp-terser'

const sass = gulpSass(dartSass)

/* HTML: copiar todo lo .html desde src a dist */
export function html() {
  return src('src/**/*.html')
    .pipe(dest('dist'))
}

/* CSS: compilar SCSS -> CSS minificado + sourcemap */
export function css() {
  return src('src/scss/main.scss', { sourcemaps: true })
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('dist/css', { sourcemaps: '.' }))
}

/* JS: minificar a dist/js */
export function js() {
  return src('src/js/main.js')
    .pipe(terser())
    .pipe(dest('dist/js'))
}

/* Imágenes: copiar tal cual */
export function images() {
  return src('src/img/**/*.{png,jpg,jpeg,svg,gif,webp,avif,ico}', { encoding: false })
    .pipe(dest('dist/img'))
}

/* Assets (iconos, fuentes, favicons, etc.) */
export function assets() {
  return src('src/assets/**/*', { encoding: false })
    .pipe(dest('dist/assets'))
}

/* Videos: copiar tal cual */
export function videos() {
  return src('src/videos/**/*.{mp4,webm,ogv,mov}', { encoding: false })
    .pipe(dest('dist/videos'))
}

/* Modo desarrollo: watchers */
export function dev() {
  watch('src/**/*.html', html)
  watch('src/scss/**/*.scss', css)
  watch('src/js/**/*.js', js)
  watch('src/img/**/*', images)
  watch('src/assets/**/*', assets)
  watch('src/videos/**/*', videos)
}

/* Build final */
export const build = series(
  html,
  parallel(css, js, images, assets, videos)
)

export default series(build, dev)
