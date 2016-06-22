// ----------------------------------
// Daemon
//
// This process will check a given directory
// on an interval. If there is a change, a
// script is run.
// ----------------------------------
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var unzip = require('unzip');
var mkdirp = require('mkdirp');
var path = require('path');
var streamify = require('./lib/streamify');
var scanner = require('./lib/scanner');
var lexer = require('./lib/lexer');
var Parser = require('./lib/_parser');
var Evaluator = require('./lib/_evaluator');

// Constants
var CONFIG_FILE_PATH = "~/.vyuha/config.json";

// Read <config-file>
// var config = fs.readFileSync(CONFIG_FILE_PATH);
var config = {
  INPUT_PATH: '../landingzone/',
  OUTPUT_PATH: '../vyuha_proj/'
};

var init = function() {
  // Watch central directory.
  var absPath = path.resolve(__dirname, config.INPUT_PATH);
  var outPath = path.resolve(__dirname, config.OUTPUT_PATH);
  chokidar.watch(absPath)

  // If there is a change,
  //    emit received event,
  //    unpackage the zip file.
    .on('add', function(addedPath) {
        var fullpath = null;
        fs.createReadStream(addedPath)
          .pipe(unzip.Parse())
          .on('entry', function(entry) {
            switch(entry.type) {
              case 'Directory':
                // Make the directory
                fullpath = path.join(outPath, entry.path);
                mkdirp(fullpath);
                break;
              case 'File':
                // Write the file
                dirpath = path.resolve(__dirname, fullpath);
                filename = path.basename(entry.path);
                filepath = path.join(dirpath, filename);
                entry.pipe(fs.createWriteStream(filepath));
            }
          })
          .on('close', function() {
            kickoff(fullpath);
          });
      })
  ;

  console.log('Watching %s for changes', absPath);

  // Once unzipped and unarchived, check for a <Scriptfile>.
  // If it exists,
  //    emit parsing event
  //    pass it to parser

  function kickoff(fullpath) {
    if (fullpath === null) { return; }
    fs.readdir(fullpath, function(err, files) {
      var isValid = files.filter(function(item) {return item === 'Vyuhafile'});
      if (isValid.length > 0) {
        var parser = new Parser();
        var evaluator = new Evaluator();
        fs.createReadStream(path.join(fullpath, 'Vyuhafile'))
          .pipe(streamify(scanner.scan))
          .pipe(streamify(lexer.lex))
          .pipe(streamify(parser.parse, parser))
          .pipe(streamify(evaluator.queue, evaluator))
          .pipe(streamify(evaluator.evaluate, evaluator))
          .on('error', function(err) {
            throw err;
          })
          ;
      }
    })
  }
  // Once parsing is done, emit success event

};

module.exports = init;

// TESTING ONLY
init();
