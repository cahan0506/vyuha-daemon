// Lexer.js
// ----------------------------------------
// Parses tokens into an abstract syntax tree

var Parser = function() {
  var self = this;

  this.ast = {
    type: 'Program',
    body: []
  };

  this._localMemory = {
    prevToken: null
  };
  this._parse = function(token, scope) {
    token = JSON.parse(token);
    if(token.type === 'TASK_ID') {
      if (scope._localMemory.prevToken &&
        scope._localMemory.prevToken.commands.length > 0) {
          // scope.ast.body.push(scope._localMemory.prevToken);
          this.push(JSON.stringify(scope._localMemory.prevToken));
        }
      var t = {
        type: 'TaskDeclaration',
        id: token.value,
        commands: []
      }
      scope._localMemory.prevToken = t;
      return;
    }
    if(token.type === 'TASK_COMMAND') {
      var t = scope._localMemory.prevToken;
      if(!scope._localMemory.prevToken) throw new Error('No task declared');
      t.commands.push(token.value);
      scope._localMemory.prevToken = t;
      return;
    }
    if(token.type === 'TASK_EXECUTION') {
      var e = {
        type: 'TaskInvocation',
        id: token.value
      };
      this.push(JSON.stringify(e));
    }
  }

  this.parse = this._parse;
}

module.exports = Parser;
