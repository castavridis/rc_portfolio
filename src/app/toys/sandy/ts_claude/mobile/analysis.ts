// ============================================================================
// MOBILE: analysis.js
// ============================================================================

const stringifyExpr = (node) => {
  if (!node) return '';
  const OPS = { ADD: '+', SUB: '-', MUL: '*', DIV: '/', LT: '<', LE: '<=', GT: '>', GE: '>=', EQ: '==', NE: '<>' };
  switch (node.type) {
    case 'Num': return String(node.value);
    case 'Str': return `"${node.value}"`;
    case 'Id': return node.name;
    case 'Wildcard': return '_';
    case 'Tuple': return `(${stringifyExpr(node.left)}, ${stringifyExpr(node.right)})`;
    case 'BinOp': return `${stringifyExpr(node.left)}${OPS[node.op] || '?'}${stringifyExpr(node.right)}`;
    case 'App': return `${stringifyExpr(node.fn)}(${node.arg ? stringifyExpr(node.arg) : ''})`;
    case 'ValLav': return 'val...lav';
    case 'IfFi': return 'if...fi';
    default: return '...';
  }
};

export const analyzeAST = (node, depth = 0) => {
  if (!node) return null;
  
  if (node.type === 'ValLav' || node.type === 'IfFi') {
    return {
      type: node.type === 'ValLav' ? 'vallav' : 'iffi',
      label: node.type === 'ValLav' ? 'val...lav' : 'if...fi',
      children: node.statements.map((stmt, i) => analyzeStatement(stmt, i, depth + 1)),
      reorderable: true,
      depth,
    };
  }
  
  return { type: 'expr', label: stringifyExpr(node), children: [], reorderable: false, depth };
};

export const analyzeStatement = (stmt, index, depth) => {
  if (stmt.type === 'Match') return { type: 'match', label: `match ${stringifyExpr(stmt.expr)}`, children: [], flippable: false, depth, index };
  if (stmt.type === 'Of') return { type: 'of', label: `of ${stringifyExpr(stmt.expr)}`, children: [], flippable: false, depth, index };
  if (stmt.type === 'Echo') return { type: 'echo', label: `echo ${stringifyExpr(stmt.expr)}`, children: [], flippable: false, depth, index };
  if (stmt.type === 'Assert') return { type: 'assert', label: `assert ${stringifyExpr(stmt.expr)}`, children: [], flippable: false, depth, index };
  
  if (stmt.type === 'When') {
    const patternStr = stringifyExpr(stmt.pattern);
    const resultStr = stringifyExpr(stmt.result);
    const nested = analyzeAST(stmt.result, depth + 1);
    const hasNested = nested && (nested.type === 'vallav' || nested.type === 'iffi');
    return {
      type: 'when', label: `${patternStr} → ${resultStr}`, labelFlipped: `${resultStr} ← ${patternStr}`,
      pattern: patternStr, result: resultStr, children: hasNested ? [nested] : [], flippable: true, depth, index,
    };
  }
  
  if (stmt.type === 'Binding') {
    const nameStr = stringifyExpr(stmt.name);
    const nested = analyzeAST(stmt.value, depth + 1);
    const hasNested = nested && (nested.type === 'vallav' || nested.type === 'iffi');
    return {
      type: 'binding', label: `${nameStr}: ...`, labelFlipped: `... ~: ${nameStr}`,
      name: nameStr, value: stringifyExpr(stmt.value), children: hasNested ? [nested] : [], flippable: true, depth, index,
    };
  }
  
  return { type: 'unknown', label: '?', children: [], flippable: false, depth, index };
};
