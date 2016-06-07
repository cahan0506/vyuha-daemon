#!/usr/bin/env node

// ----------------------------------
// CLI
//
// Command line tool
// ----------------------------------

var program = require('commander');
var vyuhaDaemon = require('../lib/vyuha-daemon');

program
  .version('0.0.1')
  .usage('<cmd>')
  .option('-d, --daemon', 'Run Vyuha as a daemon process')
  .option('-p, --package', 'Package your project')
  .option('-y, --deploy', 'Deploy your project')
  .parse(process.argv);

if (program.daemon) {
  console.log('Running in Daemon Mode');
  vyuhaDaemon();
}
else {

}
