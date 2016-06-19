// Scanner.js
// ----------------------------------------
// Scans plain text into lexemes


/**

If char is alphanumeric, add to buffer.
If char is whitespace, add buffer to list.

*/

var scan = function(body) {
  var lexemes = _scan(body);
  lexemes.forEach(this.push.bind(this));
}

var _scan = function(line) {
  var chars = line.split('');
  var lexemes = [];
  var lexeme = '';
  chars.forEach(function(char) {
    if (/\w/.test(char)) {
      lexeme += char;
      return;
    }
    if (/\t|\n|\s|\:|\;|\#/.test(char)) {
      if (lexeme.length) {
        lexemes.push(lexeme);
        lexeme = "";
      }
    }
    lexemes.push(char);
  });

  // Flush
  if (lexeme.length) {
    lexemes.push(lexeme);
  }
  return lexemes;
}

module.exports = {
  scan: scan,
  _scan: _scan
}
