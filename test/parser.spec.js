var chai = require('chai');
var expect = chai.expect;

var Parser = require('../lib/parser');

describe('#Parser', function() {
  var p = null;
  var buf = null;
  var mock = null;
  beforeEach(function() {
    p = new Parser();
    buf = [];
    mock = {
      push: function(line) {
        buf.push(line);
      }
    };
  });
  afterEach(function() {
    p = null;
    buf = null;
    mock = null;
  });
  describe('#parse', function() {
    it('should add a task id node to the parser\'s ast', function() {
      var token = {
        type: 'TASK_ID',
        value: 'HELLO'
      };
      var scope = p;
      p.parse.call(mock, JSON.stringify(token), scope);

      expect(p._localMemory.prevToken.type).to.equal('TaskDeclaration');
      expect(p._localMemory.prevToken.id).to.equal('HELLO');
      expect(p._localMemory.prevToken.commands.length).to.equal(0);
    });
    it('should add a commands to a task id node', function() {
      var token = {
        type: 'TASK_COMMAND',
        value: '\secho "hello"'
      };
      var scope = p;
      scope._localMemory.prevToken = {
        type: 'TaskDeclaration',
        id: 'HELLO',
        commands:[]
      }
      p.parse.call(mock, JSON.stringify(token), scope);

      expect(p._localMemory.prevToken.commands.length).to.equal(1);
    });
    it('should add a task execution node to the ast', function() {
      var token = {
        type: 'TASK_EXECUTION',
        value: 'HELLO'
      };
      var scope = p;
      p.parse.call(mock, JSON.stringify(token), scope);

      expect(buf.length).to.equal(1);
      expect(JSON.parse(buf[0])).to.not.equal(undefined);
      expect(JSON.parse(buf[0]).type).to.equal('TaskInvocation');
      expect(JSON.parse(buf[0]).id).to.equal('HELLO');
    });
  });
})
