var fs = require('fs');
var unzip = require('unzip');
var mkdirp = require('mkdirp');
var path = require('path');
var lexer = require('./lexer');

var addedPath = './TEST.zip';
var fullpath = null;
var config = {
  OUTPUT_PATH: './'
}
fs.createReadStream(addedPath)
  .pipe(unzip.Parse())
  .on('entry', function(entry) {
    fullpath = path.join(config.OUTPUT_PATH, entry.path)
    switch(entry.type) {
      case 'Directory':
        // Make the directory
        mkdirp(entry.path);
        break;
      case 'File':
        // Write the file
        entry.pipe(fs.createWriteStream(entry.path));
        break;
    }
  })
  .on('close', function() {
    kickoff('./');
  });

function kickoff(fullpath) {
  if (fullpath === null) { return; }
  fs.readdir(fullpath, function(err, files) {
    var isValid = files.filter(function(item) {return item === 'Vyuhafile'});
    if (isValid.length > 0) {
      fs.createReadStream(path.join(fullpath, 'Vyuhafile'))
        .pipe(lexer.scan)
        .pipe(lexer.lex)
        .pipe(process.stdout)
        // .pipe(parser.parse)
        // .pipe(evaluator.queue)
        // .pipe(success)
        ;
    }
  })
}

// kickoff('./TEST');
