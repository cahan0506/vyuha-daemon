// ----------------------------------
// Daemon
//
// This process will check a given directory
// on an interval. If there is a change, a
// script is run.
// ----------------------------------
var fs = require('fs');
var chokidar = require('chokidar');
var unzip = require('unzip');
var mkdirp = require('mkdirp');
var path = require('path');
var streamify = require('./lib/streamify');
var lexer = require('./lib/lexer');
var Parser = require('./lib/parser');
var Evaluator = require('./lib/evaluator');

// Constants
var CONFIG_FILE_PATH = "~/.vyuha/config.json";

// Read <config-file>
var config = fs.readFileSync(CONFIG_FILE_PATH);

// Watch central directory.
chokidar.watch(config.INPUT_PATH)

// If there is a change,
//    emit received event,
//    unpackage the zip file.
  .on('add', addedPath =>
      var fullpath = null;
      fs.createReadStream(addedPath)
        .pipe(unzip.Parse())
        .on('entry', function(entry) {
          switch(entry.type) {
            case 'Directory':
              // Make the directory
              fullpath = path.join(config.OUPUT_PATH, entry.path)
              mkdirp(fullpath);
              break;
            case 'File':
              // Write the file
              entry.pipe(fs.createWriteStream(fullpath));
          }
        })
        .on('close', function() {
          kickoff(fullpath);
        });
    )
;

console.log('Watching %s for changes', config.INPUT_PATH);

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
        .pipe(streamify(lexer.scan))
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
