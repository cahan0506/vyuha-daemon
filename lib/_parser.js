// Parser.js
// ----------------------------------------
// Parses tokens into an abstract syntax tree

var ps = require('./parserstate');
var transition = ps.transition;

var ASTNode = {
  type: null,
  literalValue: null,
  values: [],
  pending: false
}

var Parser = function() {
  var self = this;

  this.ast = {
    type: 'Program',
    body: []
  };

  this.initialState = ps.baseState();
  this.currentState = this.initialState;
  this.stateStore = [];
  this._tempLeaf = ps._state(ASTNode);

  this._parse = function(token) {
    var returnVal = null;
    token = JSON.parse(token);
    var newState = transition(this.currentState, token[0]);
    if (newState) {
      switch(newState.type) {
        case 'OpenLiteralState':
          this._tempLeaf['literalValue'] = token[1];
          this._tempLeaf.pending = true;
          break;
        case 'OpenBinaryState':
          this._tempLeaf.pending = true;
          break;
        case 'TaskDeclarationState':
          this._tempLeaf.type = 'TASK_DECLARATION';
          this._tempLeaf.values = [];
          break;
        case 'TaskElementDeclarationState':
          this._tempLeaf.values.push(token[1]);
          this._tempLeaf.pending = true;
          break;
        case 'BaseState':
          returnVal = this._tempLeaf.type === 'TASK_DECLARATION' ?
            this._addDeclarationNode() : this._addInvocationNode()
          break;
      }
    }
    else {
      // Invalid transition
    }

    this.currentState = newState;
    if (returnVal !== null) {
      return returnVal;
    }
  };

  this._addDeclarationNode = function() {
    var leaf = {
      type: 'TaskDeclaration',
      taskName: this._tempLeaf.literalValue,
      tasks: this._tempLeaf.values.join(' ').split('\n').join(' && ')
    }

    this.ast.body.push(leaf);
    this._tempLeaf = ps._state(ASTNode);
    return leaf;
  };

  this._addInvocationNode = function() {
    var leaf = {
      type: 'TaskInvocation',
      taskName: this._tempLeaf.literalValue
    }
    this.ast.body.push(leaf);
    this._tempLeaf = ps._state(ASTNode);
    return leaf;
  };

  this.parse = function(token) {
    // Must be called with context of stream
    var stream = this;
    var node = self._parse(token);
    if (node) {
      stream.push(JSON.stringify(node));
    }
  }
}

module.exports = Parser;
