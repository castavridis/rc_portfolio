
// ============================================================================
// INTERPRETER: tokenizer.js
// ============================================================================

const PATTERNS = [
  [/^\/\/[^\n]*/, null],
  [/^[ \t\n\r]+/, null],
  [/^"[^"]*"/, 'STR'],
  [/^val\b/, 'VAL'],
  [/^lav\b/, 'LAV'],
  [/^if\b/, 'IF'],
  [/^fi\b/, 'FI'],
  [/^match\b/, 'MATCH'],
  [/^of\b/, 'OF'],
  [/^echo\b/, 'ECHO'],
  [/^assert\b/, 'ASSERT'],
  [/^[a-zA-Z_][a-zA-Z0-9_]*/, 'NAM'],
  [/^[0-9]+/, 'NUM'],
  [/^~:/, 'RCOL'],
  [/^->/, 'THEN'],
  [/^<-/, 'WHEN'],
  [/^<=/, 'LE'],
  [/^>=/, 'GE'],
  [/^<>/, 'NE'],
  [/^==/, 'EQ'],
  [/^\(/, 'LPN'],
  [/^\)/, 'RPN'],
  [/^\+/, 'ADD'],
  [/^-/, 'SUB'],
  [/^\*/, 'MUL'],
  [/^\//, 'DIV'],
  [/^</, 'LT'],
  [/^>/, 'GT'],
  [/^,/, 'COMMA'],
  [/^:/, 'COL'],
  [/^!/, 'BANG'],
];

const tokenize = (source) => {
  const tokens = [];
  let pos = 0;
  
  while (pos < source.length) {
    let matched = false;
    for (const [regex, type] of PATTERNS) {
      const match = source.slice(pos).match(regex);
      if (match) {
        if (type) tokens.push({ type, value: match[0], pos });
        pos += match[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) throw new Error(`Unexpected character at position ${pos}: '${source[pos]}'`);
  }
  
  tokens.push({ type: 'EOF', value: '', pos });
  return tokens;
};

export default tokenize
