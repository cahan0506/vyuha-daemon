var chai = require('chai');
var spies = require('chai-spies');
var mockStream = require('./mock/mockStream');

chai.use(spies);

var expect = chai.expect;

var scanner = require('../lib/scanner');

describe('#Scanner', function() {
  var mock = null;
  beforeEach(function() {
    mock = mockStream();
  });
  afterEach(function() {
    mock = null;
  });

  describe('#_scan', function() {
    var string = null;
    var lexemes = null;
    beforeEach(function() {
      string = "MYTASK:{\
          echo this is my task;\
        }\
        MYTASK;";
      lexemes = scanner._scan(string);
    });
    afterEach(function() {
      string = null;
      lexemes = null;
    });
    it('should treat alphanumeric characters as lexemes', function() {
      expect(lexemes.indexOf("MYTASK")).to.be.above(-1);
    });
    it('should treat non alphanumeric characters as lexemes', function() {
      expect(lexemes.indexOf("{")).to.be.above(-1);
    });
    it('should parse a string into appropriate lexemes', function() {
      expect(lexemes.length).to.be.above(0);
    });
  });
  describe('#scan', function() {
    it('should push lexemes into a buffer', function() {
      scanner.scan.call(mock, "hello i am mike");
      expect(mock.getBuf().length).to.equal(7);
    });
  })
});
