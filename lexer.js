// Lexer.js
// ----------------------------------------
// Parses a file and returns a list of token-tags

var streamify = require('./streamify');

TOKEN_EXPRESSIONS = {
  COMMENT: /#.+/,
  TASK_ID: /\w+\:$/,
  TASK_COMMAND: /\s+[\s\w'-=&^%$#]+/,
  TASK_EXECUTION: /\w+\;$/
}

var scan = function(body) {
  var lines = body.split('\n');
  lines.forEach(this.push.bind(this));
}

var lex = function(lexeme) {
  // Detect token expressions
  //  if there is a match, add [token, TAG]
  //  to tokens list
  if (TOKEN_EXPRESSIONS.COMMENT.test(lexeme)) {
    var index = lexeme.indexOf('#') + 1;
    var data = {
      type: 'COMMENT',
      value: lexeme.slice(index).trim()
    }
    this.push(JSON.stringify(data));
  }
  else if (TOKEN_EXPRESSIONS.TASK_ID.test(lexeme)) {
    var index = lexeme.indexOf(':');
    var data = {
      type: 'TASK_ID',
      value: lexeme.slice(0, index).trim()
    }
    this.push(JSON.stringify(data));
  }
  else if (TOKEN_EXPRESSIONS.TASK_COMMAND.test(lexeme)) {
    var data = {
      type: 'TASK_COMMAND',
      value: lexeme.trim()
    }
    this.push(JSON.stringify(data));
  }
  else if (TOKEN_EXPRESSIONS.TASK_EXECUTION.test(lexeme)) {
    var index = lexeme.indexOf(';');
    var data = {
      type: 'TASK_EXECUTION',
      value: lexeme.slice(0, index).trim()
    }
    this.push(JSON.stringify(data));
  }
}

module.exports = {
  scan: streamify(scan),
  lex: streamify(lex)
}
