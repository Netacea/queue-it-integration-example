const {src, dest, series} = require("gulp");
const tsify = require("tsify");

const jsonModify = require('gulp-json-modify');
const vinylSource = require('vinyl-source-stream');
const browserify = require('browserify');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');

function bundle(){
	return browserify({
            basedir: ".",
            debug: false,
            entries: ["app.ts"],
            cache: {},
            packageCache: {},
        })
            .plugin(tsify)
            .bundle()
            .pipe(vinylSource("queueit-connector-cloudflare.bundle.js"))
            .pipe(dest("./dist"));
}

exports.stripPackage = () => {
    return src(['./package.json'])
        .pipe(jsonModify({ key: 'devDependencies', value: {}}))
        .pipe(jsonModify({ key: 'scripts', value: {}}))
        .pipe(dest('./'))
}

exports.buildArtifacts = series(bundle);
exports.default = exports.buildArtifacts;
exports.bundle = bundle;