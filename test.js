var fs = require('fs');
var unzip = require('unzip');
var mkdirp = require('mkdirp');
var path = require('path');
var lexer = require('./lexer');
var Parser = require('./parser');
var Evaluator = require('./evaluator');

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
      var parser = new Parser();
      var evaluator = new Evaluator();
      fs.createReadStream(path.join(fullpath, 'Vyuhafile'))
        .pipe(lexer.scan)
        .pipe(lexer.lex)
        .pipe(parser.parse)
        .pipe(evaluator.queue)
        .pipe(evaluator.evaluate)
        // .pipe(success)
        ;
    }
  })
}

// kickoff('./TEST');
