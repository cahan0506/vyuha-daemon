// ----------------------------------
// Daemon
//
// This process will check a given directory
// on an interval. If there is a change, a
// script is run.
// ----------------------------------
var fs = require('fs');
var tar = require('tar');
var chokidar = require('chokidar');
var mkdirp = require('mkdirp');
var path = require('path');
var unzip = require('unzip');

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
          fullpath = path.join(config.OUPUT_PATH, entry.path)
          switch(entry.type) {
            case 'Directory':
              // Make the directory
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

// Once unzipped and unarchived, check for a <Scriptfile>.
// If it exists,
//    emit parsing event
//    pass it to <Scriptfile> parser

function kickoff(fullpath) {
  if (fullpath === null) { return; }
  fs.readdir(fullpath, function(err, files) {
    var isValid = files.filter(function(item) {return item === 'Vyuhafile'});
    if (isValid.length > 0) {
      fs.createReadStream(path.join(fullpath, 'Vyuhafile'))
        // .pipe(lexer.scan())
        .pipe(lexer.lex)
        .pipe(process.stdout)
        // .pipe(parser.parse)
        // .pipe(evaluator.queue)
        // .pipe(success)
        ;
    }
  })
}

// Once parsing is done, emit success event
