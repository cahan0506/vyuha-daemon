var chai = require('chai');
var spies = require('chai-spies');
var mockStream = require('./mock/mockStream');

chai.use(spies);
var expect = chai.expect;

var Parser = require('../lib/_parser');

describe('#Parser', function() {
  var parser = null;
  beforeEach(function() {
    parser = new Parser();
  });
  afterEach(function() {
    parser = null;
  })
  describe('#_parse', function() {
    var tokens = null;
    beforeEach(function() {
      tokens = [['LITERAL', 'MYTASK'], ['BINARY_OPERATOR', ':'], ['LPARENS', '{'], ['LITERAL', 'echo'], ['LITERAL', 'hello'], ['RPARENS', '}'], ['LITERAL', 'MYTASK'], ['UNARY_OPERATOR', ';']];
    });
    afterEach(function() {
      tokens = null;
    });
    it('should adjust the temp for an open literal', function() {
      parser._parse(tokens[0]);
      expect(parser._tempLeaf.pending).to.equal(true);
      expect(parser._tempLeaf.literalValue).to.equal(tokens[0][1]);
    });
    it('should adjust the temp for an open binary operator', function() {
      parser._parse(tokens[0]);
      parser._parse(tokens[1]);
      expect(parser._tempLeaf.pending).to.equal(true);
    });
    it('should adjust the temp for a task declaration', function() {
      parser._parse(tokens[0]);
      parser._parse(tokens[1]);
      parser._parse(tokens[2]);
      expect(parser._tempLeaf.type).to.equal('TASK_DECLARATION');
      expect(Array.isArray(parser._tempLeaf.values)).to.equal(true);
      expect(parser._tempLeaf.values.length).to.equal(0);
    });
    it('should adjust the temp for a task element declaration', function() {
      parser._parse(tokens[0]);
      parser._parse(tokens[1]);
      parser._parse(tokens[2]);
      parser._parse(tokens[3]);
      parser._parse(tokens[4]);
      expect(Array.isArray(parser._tempLeaf.values)).to.equal(true);
      expect(parser._tempLeaf.values.length).to.equal(2);
      expect(parser._tempLeaf.values[0]).to.equal('echo');
      expect(parser._tempLeaf.values[1]).to.equal('hello');
    });
    it('should return to base state', function() {
      parser._parse(tokens[0]);
      parser._parse(tokens[1]);
      parser._parse(tokens[2]);
      parser._parse(tokens[3]);
      parser._parse(tokens[4]);
      var node = parser._parse(tokens[5]);

      expect(node).not.to.equal(undefined);
    })
  });
  describe('#_addDeclarationNode', function() {
    it('should add a declaration node', function() {
      parser._tempLeaf.literalValue = 'TEST';
      parser._tempLeaf.values = ['echo', 'hello'];
      parser._addDeclarationNode();
      expect(parser.ast.body.length).to.equal(1);
      expect(parser.ast.body[0].type).to.equal('TaskDeclaration');
      expect(parser.ast.body[0].taskName).to.equal('TEST');
      expect(parser.ast.body[0].tasks[0]).to.equal('echo hello');
    });
  });
  describe('#_addInvocationNode', function() {
    it('should add an invocation node', function() {
      parser._tempLeaf.literalValue = 'TEST';
      parser._addInvocationNode();
      expect(parser.ast.body.length).to.equal(1);
      expect(parser.ast.body[0].type).to.equal('TaskInvocation');
      expect(parser.ast.body[0].taskName).to.equal('TEST');
    });
  });
  describe('#parse', function() {
    var mock = null;
    var tokens = null;
    beforeEach(function() {
      mock = mockStream();
      tokens = [['LITERAL', 'MYTASK'], ['BINARY_OPERATOR', ':'], ['LPARENS', '{'], ['LITERAL', 'echo'], ['LITERAL', 'hello'], ['RPARENS', '}'], ['LITERAL', 'MYTASK'], ['UNARY_OPERATOR', ';']];
    });
    afterEach(function() {
      mock = null;
      tokens = null;
    });
    it('should push AST nodes into a buffer', function() {
      parser.parse.call(mock, tokens[0]);
      parser.parse.call(mock, tokens[1]);
      parser.parse.call(mock, tokens[2]);
      parser.parse.call(mock, tokens[3]);
      parser.parse.call(mock, tokens[4]);
      parser.parse.call(mock, tokens[5]);
      expect(mock.getBuf().length).to.equal(1);
    });
  })
});
