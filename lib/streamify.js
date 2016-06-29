var stream = require('stream');

// This is how streamify is supposed to work:
// streamify(function(text) {})

var streamify = function(fn, env) {
  var s = new stream.Transform({objectMode: true});
  s._transform = function(chunk, enc, done) {
      fn.bind(this)(chunk.toString(), env);
      done();
  }

  return s;
}

module.exports = streamify;
