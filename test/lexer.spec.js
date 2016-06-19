var chai = require('chai');
var spies = require('chai-spies');
var mockStream = require('./mock/mockStream');

chai.use(spies);
var expect = chai.expect;

var lexer = require('../lib/lexer');

describe('#Lexer', function() {
  describe('#_lex', function() {
    it('should return a literal token', function() {
      var token = lexer._lex("hello");
      expect(token[0]).to.equal("LITERAL");
      expect(token[1]).to.equal("hello");
    });
    it('should return a punctuator token', function() {
      var token = lexer._lex("\"");
      expect(token[0]).to.equal("PUNCTUATOR");
      expect(token[1]).to.equal("\"");
    });
    it('should return an binary operator token', function() {
      var token = lexer._lex(":");
      expect(token[0]).to.equal("BINARY_OPERATOR");
      expect(token[1]).to.equal(":");
    });
    it('should return an unary operator token', function() {
      var token = lexer._lex(";");
      expect(token[0]).to.equal("UNARY_OPERATOR");
      expect(token[1]).to.equal(";");
    });
    it('should return an lparens token', function() {
      var token = lexer._lex("{");
      expect(token[0]).to.equal("LPARENS");
      expect(token[1]).to.equal("{");
    });
    it('should return an rparens token', function() {
      var token = lexer._lex("}");
      expect(token[0]).to.equal("RPARENS");
      expect(token[1]).to.equal("}");
    });
    it('should return a comment token', function() {
      var token = lexer._lex("#");
      expect(token[0]).to.equal("COMMENT");
      expect(token[1]).to.equal("#");
    });
  });
  describe('#lex', function() {
    var mock = null;
    beforeEach(function() {
      mock = mockStream();
    });
    afterEach(function() {
      mock = null;
    });
    it('should push tokens into a buffer', function() {
      lexer.lex.call(mock, 'hello');
      expect(mock.getBuf().length).to.equal(1);
    });
  })
});
