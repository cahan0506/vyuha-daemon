// Scanner.js
// ----------------------------------------
// Scans plain text into lexemes


/**

If char is alphanumeric, add to buffer.
If char is whitespace, add buffer to list.

*/

var scan = function(body) {
  var lexemes = [];
  lexemes = scanLine(body);
  this.push(lexemes);
  lexemes = lexemes.reduce(function(acc, item) {
    return acc.concat(item);
  }, []);
  lexemes.forEach(this.push.bind(this));
}

var scanLine = function(line) {
  var chars = line.split('');
  var lexemes = [];
  var lexeme = '';
  chars.forEach(function(char) {
    if (/\w/.test(char)) {
      lexeme += char;
      return;
    }
    else if (/\s/.test(char)) {
      lexemes.push(lexeme);
      return;
    }
    else {
      lexeme = char;
    }

    lexemes.push(lexeme);
  });

  return lexemes;
}

module.exports = {
  scan: scan
}
