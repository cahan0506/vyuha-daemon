// Lexer.js
// ----------------------------------------
// Parses a file and returns a list of token-tags

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
  var index = null;
  var data = null;
  if (TOKEN_EXPRESSIONS.COMMENT.test(lexeme)) {
    index = lexeme.indexOf('#') + 1;
    data = {
      type: 'COMMENT',
      value: lexeme.slice(index).trim()
    }
  }
  else if (TOKEN_EXPRESSIONS.TASK_ID.test(lexeme)) {
    index = lexeme.indexOf(':');
    data = {
      type: 'TASK_ID',
      value: lexeme.slice(0, index).trim()
    }
  }
  else if (TOKEN_EXPRESSIONS.TASK_COMMAND.test(lexeme)) {
    data = {
      type: 'TASK_COMMAND',
      value: lexeme.trim()
    }
  }
  else if (TOKEN_EXPRESSIONS.TASK_EXECUTION.test(lexeme)) {
    index = lexeme.indexOf(';');
    data = {
      type: 'TASK_EXECUTION',
      value: lexeme.slice(0, index).trim()
    }
  }

  if (data) {
    this.push(JSON.stringify(data));
  }
}

module.exports = {
  scan: scan,
  lex: lex
}
