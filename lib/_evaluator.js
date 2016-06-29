// Evaluator.js
// ----------------------------------------
// Evaluates AST nodes as bash commands

var exec = require('child_process').execSync;

var Evaluator = function() {
  var self = this;
  this._table = {};

  this._queue = function(astNode) {
    astNode = JSON.parse(astNode);
    if (astNode.type === 'TaskDeclaration') {
      this._table[astNode.taskName] = astNode.tasks;
    }
    else if (astNode.type === 'TaskInvocation') {
      var tasks = this._table[astNode.taskName];
      if (!tasks) {
        throw new Error(`EvaluationError: Task ${astNode.taskName} is undefined.`);
      }
      return tasks;
    }
  }

  this._evaluate = function(command) {
    var stdout = exec(command);
    console.log(stdout.toString());
  }

  this.queue = function(astNode) {
    // This function should be evaluated in
    // the context of a stream
    // i.e. queue.call(Stream, astNode);
    var tasks = self._queue(astNode);
    if (Array.isArray(tasks)) {
      tasks.forEach(this.push.bind(this));
    }
    else if (typeof(tasks) === 'string') {
      this.push(tasks);
    }
  }

  this.evaluate = function(command) {
    // This function should be evaluated in
    // the context of a stream
    // i.e. evaluate.call(Stream, command);
    self._evaluate(command);
  }
}

module.exports = Evaluator;
