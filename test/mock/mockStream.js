var mockStream = function() {
  var buf = null;
  var mock = null;
  buf = [];
  mock = {
    push: function(line) {
      buf.push(line);
    },
    getBuf: function() {
      return buf;
    }
  };

  return mock;
}

module.exports = mockStream;
