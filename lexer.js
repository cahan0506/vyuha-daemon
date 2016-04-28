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

var lex = function(line) {
  // Detect token expressions
  //  if there is a match, add [token, TAG]
  //  to tokens list
  if (TOKEN_EXPRESSIONS.COMMENT.test(line)) {

  }
  else if (TOKEN_EXPRESSIONS.TASK_ID.test(line)) {

  }
  else if (TOKEN_EXPRESSIONS.TASK_COMMAND.test(line)) {

  }
  else if (TOKEN_EXPRESSIONS.TASK_EXECUTION.test(line)) {

  }
}

module.exports = streamify(lex);
