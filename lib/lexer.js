// Lexer.js
// ----------------------------------------
// Parses a file and returns a list of token-tags

TOKEN_EXPRESSIONS = {
  PUNCTUATOR: /\"|\(|\)\-\_/,
  BINARY_OPERATOR: /\:/,
  UNARY_OPERATOR: /\;/,
  LPARENS: /\{/,
  RPARENS: /\}/,
  LITERAL: /[A-Za-z0-9\-\.]/
}

var commentOn = false;
var _lex = function(lexeme) {
  var token = [];
  for (var tokenName in TOKEN_EXPRESSIONS) {
    if (TOKEN_EXPRESSIONS[tokenName].test(lexeme)) {
        token.push(tokenName, lexeme);
        break;
    }
  }
  if (token.length) {
      return token;
  }
}

var lex = function(lexeme) {
  var token = _lex(lexeme);
  if (token) {
    this.push(JSON.stringify(token));
  }
}

module.exports = {
  lex: lex,
  _lex: _lex
}
