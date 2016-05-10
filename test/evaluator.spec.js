var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);
var expect = chai.expect;

var Evaluator = require('../lib/evaluator');

describe('#Evaluator', function() {
  var e = null;
  beforeEach(function() {
    e = new Evaluator();
  });
  afterEach(function() {
    e = null;
  });
  describe('#queue', function() {
    it('should add shell commands to a task declaration node', function() {
      var node = JSON.stringify({
        type: 'TaskDeclaration',
        id: 'HELLO',
        commands: ['echo "hello world"']
      });
      var scope = {
        table: {}
      };
      e.queue(node, scope);
      expect(scope.table['HELLO']).to.not.equal(undefined);
      expect(scope.table['HELLO'][0]).to.equal('echo "hello world"');
    })
  })
})
