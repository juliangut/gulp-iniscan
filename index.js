'use strict';

var extend = require('extend');
var through = require('through2');
var exec = require('child_process').exec;
var File = require('gulp-util').file;

var commandAttributes = [
  'threshold',
  'php',
  'format',
  'context'
];
var commandOptions = [
  'fail-only'
];

var buildCommand = function(file, opt) {
  var opt = opt || {};
  var command = (opt.bin || 'iniscan') + ' scan';

  if (!file.isNull()) {
    command += ' --path=' + file.path;
  }

  commandAttributes.forEach(function(attribute) {
    if (opt.hasOwnProperty(attribute)) {
      command += ' --' + attribute + '=' + opt[attribute];
    }
  });

  commandOptions.forEach(function(option) {
    if (opt.hasOwnProperty(option) && opt[option] == true) {
      command += ' --' + option;
    }
  });

  return command;
};

var iniscan = function(options) {
  var options = extend(
    {
      bin: 'iniscan',
      format: 'console'
    },
    options
  );

  function runCommand(file, enc, callback) {
    if (!file.isNull() && file.isStream()) {
      return callback(new Error('Streams are not supported'));
    }

    if (!file.isNull() && !/\.ini$/i.test(file.path)) {
      return callback(new Error('Only ini files supported'));
    }

    if (options.hasOwnProperty('threshold')) {
      options.threshold = options.threshold.replace(/^\s+|\s+$/g, '').toUpperCase();

      if (['WARNING', 'ERROR', 'FATAL'].indexOf(options.threshold) === -1) {
        return callback(new Error(options.threshold + ' is not valid threshold level'));
      }
    }

    if (options.hasOwnProperty('php')) {
      options.php = options.php.replace(/^\s+|\s+$/g, '');

      if (!/^[0-9]+((\.[0-9]+)?\.[0-9]+)?$/.test(options.php)) {
        return callback(new Error(options.php + ' is not a valid PHP version'));
      }
    }

    if (options.hasOwnProperty('format')) {
      options.format = options.format.replace(/^\s+|\s+$/g, '').toLowerCase();

      if (['console', 'html', 'json', 'xml'].indexOf(options.format) === -1) {
        return callback(new Error('Format ' + options.format + ' is not supported'));
      }
    }

    var stream = this;

    exec(buildCommand(file, options), function(error, stdout, stderr) {
      if (options.format === 'console' && !/0 failure\(s\)/.test(stdout)) {
        console.log(stdout.replace(/^.+\n/, '').replace(/\n/g, '\n\t'));
        return callback();
      }

      if (options.format !== 'console' && stdout.length) {
        var outputFile = new File({
          cwd: '',
          base: '',
          path: 'iniscan-output.' + options.format,
          contents: new Buffer(stdout),
          stat: {
            isFile: function () { return true; },
            isDirectory: function () { return false; },
            isBlockDevice: function () { return false; },
            isCharacterDevice: function () { return false; },
            isSymbolicLink: function () { return false; },
            isFIFO: function () { return false; },
            isSocket: function () { return false; }
          }
        });

        stream.push(outputFile);
      }

      callback();
    })
  }

  return through.obj(runCommand);
};

module.exports = iniscan;
