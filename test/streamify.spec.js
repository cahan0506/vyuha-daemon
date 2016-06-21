var chai = require('chai');
var expect = chai.expect;

var streamify = require('../lib/streamify');

describe('#Streamify', function() {
  describe('main', function() {
    it('should return a transformable stream', function() {
      // NOTE: This test uses duck typing to make assertions.
      var fn = function() {};
      var s = streamify(fn);
      expect(s.constructor.name).to.equal('Transform');
    })
  })
})
