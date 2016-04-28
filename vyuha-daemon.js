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
      fs.createReadStream(addedPath)
        .pipe(unzip.Parse())
        .on('entry', function(entry) {
          switch(entry.type) {
            case 'Directory':
              // Make the directory
              mkdirp(entry.path);
              break;
            case 'File':
              // Write the file
              fs.createWriteStream(entry.path);
              break;
          }
        });
    )
;

// Once unzipped and unarchived, check for a <Scriptfile>.
// If it exists,
//    emit parsing event
//    pass it to <Scriptfile> parser

function kickoff(fullpath) {
  fs.readdir(fullpath, function(err, files) {
    var isValid = files.filter(function(item) {return item === 'Vyuhafile'});
    if (isValid) {
      fs.createReadStream(path.join(fullpath, 'Vyuhafile'))
        .pipe(lexer.lex())
        .pipe(parser.parse())
        .pipe(executer.execute())
        .pipe(success())
        ;
    }
  })
}

// Once parsing is done, emit success event
