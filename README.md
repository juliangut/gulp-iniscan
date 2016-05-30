[![Latest Version](https://img.shields.io/npm/v/gulp-iniscan.svg?style=flat-square)](https://npmjs.org/package/gulp-iniscan)
[![License](https://img.shields.io/github/license/juliangut/gulp-iniscan.svg?style=flat-square)](https://github.com/juliangut/gulp-iniscan/blob/master/LICENSE)

[![Total Downloads](https://img.shields.io/npm/dt/gulp-iniscan.svg?style=flat-square)](https://npmjs.org/package/gulp-iniscan)
[![Monthly Downloads](https://img.shields.io/npm/dm/gulp-iniscan.svg?style=flat-square)](https://npmjs.org/package/gulp-iniscan)

# iniscan Gulp plugin

> Gulp plugin for running [iniscan](https://github.com/psecio/iniscan)

## Getting Started

If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide, as it explains how to create a `gulpfile`. Once you're familiar with that process, you may install this plugin

```shell
npm install gulp-iniscan --save-dev
```

Make sure you have iniscan installed

```shell
composer require psecio/iniscan
```

## Usage

### Task

```js
var iniscan = require('iniscan');

gulp.task('iniscan', function() {
  return gulp.src('path_to/php.ini')
    .pipe(iniscan({
      bin: 'vendor/bin/iniscan',
      threshold: 'ERROR'
    }));
});
```

If no path to a `php.ini` file is selected on the stream global PHP ini file will be used. To find your global PHP ini file run:

```
php -i | grep 'Loaded Configuration File' | sed 's/Loaded Configuration File *=> *//g'
```

### API

#### bin
Type: `String`
Default value: `'iniscan'`

iniscan executable binary.

In case you do not provide iniscan binary path you need to have it on PATH environment variable otherwise plugin will raise an error

#### threshold
Type: `String`
Default value: `WARNING`

Minimum rule threshold to scan upon. One of `WARNING`, `ERROR` or `FATAL`

#### format
Type: `String`
Default value: `'console'`

Output report format. One of `console`, `html`, `json` or `xml`

In case a format other than console is selected the resulting formatted report will be added to the stream so it can be saved elsewhere

```js
var iniscan = require('iniscan');

gulp.task('iniscan', function() {
  return gulp.src('')
    .pipe(iniscan({
      bin: 'vendor/bin/iniscan',
      format: 'json'
    }))
    .pipe(gulp.dest('output_path'));
});
```

#### context
Type: `String`
Default value: `'prod'`

Context to scan rules against, rules out of the specified context won't be checked.

#### php
Type: `String`
Default value: `undefined`

PHP version to scan upon. If none provided current php-cli `PHP_VERSION`is used.


## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/grunt-iniscan/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/juliangut/grunt-iniscan/blob/master/CONTRIBUTING.md)

## License

See file [LICENSE](https://github.com/juliangut/grunt-iniscan/blob/master/LICENSE) included with the source code for a copy of the license terms.
