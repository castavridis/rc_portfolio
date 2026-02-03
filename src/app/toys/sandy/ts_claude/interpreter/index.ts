// ============================================================================
// INTERPRETER: index.js
// ============================================================================

import { evaluate } from './evaluator';
import { Parser } from './parser';
import tokenize from './tokenizer';

const runCalder = (source) => {
  const output = [];
  try {
    const tokens = tokenize(source);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const result = evaluate(ast, {}, output);
    output.push(`=> ${result}`);
    return { success: true, output, ast };
  } catch (e) {
    output.push(`Error: ${e.message}`);
    return { success: false, output, ast: null };
  }
};

export default runCalder
