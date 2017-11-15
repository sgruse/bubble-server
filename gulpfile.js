// External Dependencies
const gulp = require('gulp')
const ts = require('gulp-typescript')
const gulpCopy = require('gulp-copy')
const plumber = require('gulp-plumber')
const cache = require('gulp-cached')
const shell = require('gulp-shell')
const once = require('gulp-once')
// const tslint = require('gulp-tslint')
// const sequelize = require('sequelize')
const del = require('del')
const DotENV = require('dotenv')

// Args
var options = process.argv.slice(2)

/**
 * Vinyl is a simple metadata object that describes details about a file.
 * Mainly: Path & Contents
 * This metadata represents files not only on the file system, 
 * but also files in third parties (S3, Dropbox, etc...)
 * 
 * Gulp.src():
 * Emmits matching provided by a glob and returns a stream of files
 * that can be piped into plugins (Plumber, Gulp-Copy, etc...)
 */

// Pull in the typescript config for gulp typescript compiler
const tsProject = ts.createProject('tsconfig.json', { noImplicitAny: true, outDir: 'dist' })

const filesToWatch = [
	'./**/*.ts',
	'./**/.test.ts',
	'!./node_modules/**/*.ts',
	'!./node_modules/@types',
	'!./dist/**/*.ts',
	'!./type'
]

/**
 * Destroys the 'dist folder'.
 */
const cleanDistFolder = 'clean:dist'
gulp.task(cleanDistFolder, () => {
	return del([
		'./dist/**/*'
	])
})

/**
 * Copy static files to 'dist' folder.
 */
const copyStaticResources = 'copyStaticResources'
gulp.task(copyStaticResources, () => {
	const staticSources = ['./views/*.hbs']
	return gulp.src(staticSources)
	.pipe(gulpCopy('./dist/'))
})

/**
 * Transpiling .ts files.
 * Run this task to confirm if all .ts files 
 * are being transpiled correctly.
 */
const transpileTS = 'transpileTS'
gulp.task(transpileTS, [cleanDistFolder], () => {
	// Copy static files
	gulp.start(copyStaticResources)

	/**
	 * plumber: catches errors located in streams.
	 * cache: caches files when it see's them, if the same files passes
	 * through unchanged, it will not be subjected to the provided task (transpileTS)
	 * Finally we pipe into the tsConfig
	 */
	return tsProject.src()
	.pipe(plumber())
	.pipe(cache('tranpileTS'))
	.pipe(tsProject())
	// .once('error', () => {
	// 	if (options.indexOf('--force') === -1) {
	// 		this.once('finish', () => process.exit(1))
	// 	}
	// })
	.js.pipe(gulp.dest('dist'))
})

/**
 * Start the server
 */
const startServer = 'startServer'
const serverStartCommand = 'node ./dist/config/index.js'
gulp.task(startServer, [transpileTS], shell.task(serverStartCommand))
	

/**
 * The watchTS task will transpile all .ts files and start the server.`
 */
const watchTS = 'watchTS'
gulp.task(watchTS, [transpileTS, startServer], () => {
	return gulp.watch(filesToWatch, [transpileTS, startServer]);
});

gulp.task('default', [watchTS])