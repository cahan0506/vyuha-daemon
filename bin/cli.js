// ----------------------------------
// CLI
//
// Command line tool
// ----------------------------------

var argv = require('minimist')(process.argv.slice(2));

var daemonFlag = argv.d;

if (d) {
  console.log('will run daemon process');
}
