// chai = require 'chai'
// spies = require 'chai-spies'

// chai.use spies
// expect = chai.expect

// base = require '../base'
// ArrayInterface = require '../Array'
// describe 'BaseTest', ->
//     baseObj = null
//     describe '#_val', ->
//         it 'should store the passed in object', ->
//             baseObj = base id:'hello'
//             expect(baseObj._val.id).to.equal 'hello'

var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);
var expect = chai.expect;

var lexer = require('../lib/lexer');

describe('#Lexer', function() {
  var buf = null;
  var mock = null;
  beforeEach(function() {
    buf = [];
    mock = {
      push: function(line) {
        buf.push(line);
      }
    };
  });
  afterEach(function() {
    buf = null;
    mock = null;
  });
  describe('#lex', function() {
    it('should detect a comment', function() {
      var lexeme = "# -------";
      lexer.lex.call(mock, lexeme);

      var data = JSON.parse(buf[0]);
      expect(buf.length).to.equal(1);
      expect(data.type).to.equal("COMMENT");
    });

    it('should detect a task id', function() {
      var lexeme = "HELLO:";
      lexer.lex.call(mock, lexeme);

      var data = JSON.parse(buf[0]);
      expect(buf.length).to.equal(1);
      expect(data.type).to.equal("TASK_ID");
    });

    it('should detect a task command', function() {
      var lexeme = "\secho 'yes'";
      lexer.lex.call(mock, lexeme);

      var data = JSON.parse(buf[0]);
      expect(buf.length).to.equal(1);
      expect(data.type).to.equal("TASK_COMMAND");
    });

    it('should detect a task execution', function() {
      var lexeme = "\sHELLO;";
      lexer.lex.call(mock, lexeme);

      var data = JSON.parse(buf[0]);
      expect(buf.length).to.equal(1);
      expect(data.type).to.equal("TASK_EXECUTION");
    });
  })
});
