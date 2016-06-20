// -------------
// Parser States
// --------------
var _states = {
  'BaseState': {
    type: 'BaseState',
    from: ['TaskDeclarationState', 'OpenLiteralState'],
    to: {
      'LITERAL' : 'OpenLiteralState',
      'COMMENT' : 'CommentState'
    },
    isTerminal: true
  },
  'OpenLiteralState': {
    type: 'OpenLiteralState',
    from: ['BaseState'],
    to: {
      'UNARY_OPERATOR' : 'BaseState',
      'BINARY_OPERATOR' : 'OpenBinaryState',
      'COMMENT' : 'CommentState'
    }
  },
  'OpenBinaryState': {
    type: 'OpenBinaryState',
    from: ['OpenLiteralState'],
    to: {
      'LPARENS' : 'TaskDeclarationState',
      'COMMENT' : 'CommentState'
    }
  },
  'TaskDeclarationState': {
    type: 'TaskDeclarationState',
    from: ['OpenBinaryState'],
    to: {
      'RPARENS' : 'BaseState',
      'COMMENT' : 'CommentState',
      'LITERAL' : 'TaskElementDeclarationState',
      'UNARY_OPERATOR' : 'TaskElementDeclarationState'
    }
  },
  'TaskElementDeclarationState': {
    type: 'TaskElementDeclarationState',
    from: ['TaskDeclarationState'],
    to: {
      'LITERAL' : 'TaskElementDeclarationState',
      'UNARY_OPERATOR' : 'TaskElementDeclarationState',
      'COMMENT' : 'CommentState',
      'RPARENS' : 'BaseState'
    }
  },
  'CommentState': {
    type: 'CommentState',
    from: ['*'],
    to: {
      'NEWLINE' : '*',
      'LITERAL' : 'CommentState'
    }
  }
};

function _state(params) {
  return Object.assign(new Function(), params);
}

// -----------------
// Transition function
// -----------------
function transition(fromState, tag) {
  if (toStateName = fromState.to[tag]) {
    var toStateModel = _states[toStateName];
    return _state(toStateModel);
  }
}

function baseState() {
  return _state(_states['BaseState']);
}

module.exports = {
  baseState: baseState,
  _states: _states,
  _state: _state,
  transition: transition
}
