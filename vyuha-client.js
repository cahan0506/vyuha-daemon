// ----------------------------------
// Client
//
// Tools for packaging and deployment
// ----------------------------------
var exec = require('child_process').execSync;
var fs = require('fs');
var pkgJson = require('./package.json');
var archiver = require('archiver');

var package = function() {
  var projectPath = './';
  var projectName = 'TEST';
  var archive = archiver('zip');
  var output = fs.createWriteStream(projectName + '.zip');

  // OS detection
  // Archive
  // Zip
  archive.pipe(output);
  
  archive.on('error', function(err) {
    throw err;
  });
  output.on('close', function() { 
    console.log('Package complete!');
  });
  archive.bulk([
    {expand: true, cwd: projectPath, src:['**/*']}
  ]).finalize();
}

var deploy = function() {
  // Validate
  // SCP
  // Success
}

module.exports = {
  package: package,
  deploy: deploy
}