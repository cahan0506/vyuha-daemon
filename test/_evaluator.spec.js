var exec = require('child_process').execSync;
var chai = require('chai');
var mockStream = require('./mock/mockStream');
var expect = chai.expect;

var Evaluator = require('../lib/_evaluator');

describe('#Evaluator', function() {
  var evaluator = null;
  beforeEach(function() {
    evaluator = new Evaluator();
  });
  afterEach(function() {
    evaluator = null;
  });
  describe('#_queue', function() {
    it('should take in a node and populate the evaluator\'s lookup table', function() {
      var mockNode = {
        type: 'TaskDeclaration',
        taskName: 'test',
        tasks: ['echo']
      };
      evaluator._queue(mockNode);
      expect(Array.isArray(evaluator._table['test'])).to.equal(true);
      expect(evaluator._table['test'][0]).to.equal('echo');
    });
    it('should throw an error for an undefined task', function() {
      var mockNode = {
        type: 'TaskInvocation',
        taskName: 'test'
      }
      try {
        evaluator._queue(mockNode);
      }
      catch(err) {
        expect(err).not.to.equal(undefined);
        expect(err.message).to.equal('EvaluationError: Task test is undefined.');
      }
    });
    it('should return tasks for an invocation', function() {
      var mockNode = {
        type: 'TaskDeclaration',
        taskName: 'test',
        tasks: ['echo']
      };
      var mockNode2 = {
        type: 'TaskInvocation',
        taskName: 'test'
      };
      var res1 = evaluator._queue(mockNode);
      var res2 = evaluator._queue(mockNode2);
      expect(res1).to.equal(undefined);
      expect(Array.isArray(res2)).to.equal(true);
      expect(res2[0]).to.equal('echo');
    });
  });
});
