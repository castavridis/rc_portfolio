// ============================================================================
// CALDER MOBILE - Refactored
// A visualizer for the Calder esoteric programming language
// ============================================================================

import React, { useState, useMemo, useCallback, useEffect } from 'react';

// ============================================================================
// CONFIG: colors.js
// ============================================================================

const nodeColors = {
  vallav: '#f97316',
  iffi: '#f97316',
  of: '#0ea5e9',
  match: '#22c55e',
  when: '#ec4899',
  binding: '#8b5cf6',
  echo: '#06b6d4',
  assert: '#eab308',
  default: '#64748b',
};

const getNodeColor = (type) => nodeColors[type] || nodeColors.default;

// ============================================================================
// CONFIG: examples.js
// ============================================================================

const examples = {
  factorial: `val
  of fac(7)
!
  fac(n): if
    match n
  !
    m+1 -> n*fac(m)
  !
    0 -> 1
  fi
lav`,

  gcd: `val
  of gcd(6*5*11, 6*13*5)
!
  gcd(j,k): if
    match (j-k, k-j)
  !
    (_,m+1) -> gcd(j, k-j)
  !
    (0,0) -> j
  !
    (m+1,_) -> gcd(j-k, k)
  fi
lav`,

  fibonacci: `val
  of fib(10)
!
  fib(n): if
    match n
  !
    0 -> 0
  !
    1 -> 1
  !
    m+2 -> fib(m) + fib(m+1)
  fi
lav`,

  echo: `val
  of x + y
!
  x: 10
!
  y: 20
!
  echo x * y
lav`,

  isEven: `val
  of isEven(7)
!
  isEven(n): if
    match n
  !
    0 -> 1
  !
    1 -> 0
  !
    m+2 -> isEven(m)
  fi
lav`,

  power: `val
  of pow(2, 10)
!
  pow(b, e): if
    match e
  !
    0 -> 1
  !
    n+1 -> b * pow(b, n)
  fi
lav`,
};

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

// ============================================================================
// INTERPRETER: values.js
// ============================================================================

class CalderNum {
  constructor(v) { this.v = v; }
  toString() { return String(this.v); }
}

class CalderStr {
  constructor(s) { this.s = s; }
  toString() { return `"${this.s}"`; }
}

class CalderTuple {
  constructor(left, right) { this.left = left; this.right = right; }
  toString() { return `(${this.left}, ${this.right})`; }
}

class CalderClosure {
  constructor(param, body, env) { this.param = param; this.body = body; this.env = env; }
  toString() { return '<function>'; }
}

// ============================================================================
// INTERPRETER: parser.js
// ============================================================================

class Parser {
  constructor(tokens) { this.tokens = tokens; this.pos = 0; }
  
  peek() { return this.tokens[this.pos]; }
  advance() { return this.tokens[this.pos++]; }
  
  expect(type) {
    const tok = this.advance();
    if (tok.type !== type) throw new Error(`Expected ${type}, got ${tok.type}`);
    return tok;
  }
  
  match(...types) {
    if (types.includes(this.peek().type)) return this.advance();
    return null;
  }
  
  parse() { return this.expr(); }
  expr() { return this.comparison(); }
  
  comparison() {
    let left = this.additive();
    while (true) {
      const op = this.match('LT', 'LE', 'GT', 'GE', 'EQ', 'NE');
      if (!op) break;
      left = { type: 'BinOp', op: op.type, left, right: this.additive() };
    }
    return left;
  }
  
  additive() {
    let left = this.multiplicative();
    while (true) {
      const op = this.match('ADD', 'SUB');
      if (!op) break;
      left = { type: 'BinOp', op: op.type, left, right: this.multiplicative() };
    }
    return left;
  }
  
  multiplicative() {
    let left = this.unary();
    while (true) {
      const op = this.match('MUL', 'DIV');
      if (!op) break;
      left = { type: 'BinOp', op: op.type, left, right: this.unary() };
    }
    return left;
  }
  
  unary() {
    if (this.match('SUB')) return { type: 'BinOp', op: 'SUB', left: { type: 'Num', value: 0 }, right: this.unary() };
    return this.call();
  }
  
  call() {
    let expr = this.primary();
    while (this.peek().type === 'LPN') {
      this.advance();
      if (this.match('RPN')) {
        expr = { type: 'App', fn: expr, arg: null };
      } else {
        const arg = this.tupleExpr();
        this.expect('RPN');
        expr = { type: 'App', fn: expr, arg };
      }
    }
    return expr;
  }
  
  tupleExpr() {
    let left = this.expr();
    while (this.match('COMMA')) left = { type: 'Tuple', left, right: this.expr() };
    return left;
  }
  
  primary() {
    if (this.match('LPN')) {
      const inner = this.tupleExpr();
      this.expect('RPN');
      return inner;
    }
    if (this.peek().type === 'NUM') return { type: 'Num', value: parseInt(this.advance().value) };
    if (this.peek().type === 'STR') {
      const s = this.advance().value;
      return { type: 'Str', value: s.slice(1, -1) };
    }
    if (this.peek().type === 'NAM') {
      const name = this.advance().value;
      return name === '_' ? { type: 'Wildcard' } : { type: 'Id', name };
    }
    if (this.peek().type === 'VAL') return this.valLav();
    if (this.peek().type === 'IF') return this.ifFi();
    throw new Error(`Unexpected token: ${this.peek().type}`);
  }
  
  statements() {
    const stmts = [this.statement()];
    while (this.match('BANG')) stmts.push(this.statement());
    return stmts;
  }
  
  statement() {
    if (this.match('MATCH')) return { type: 'Match', expr: this.tupleExpr() };
    if (this.match('OF')) return { type: 'Of', expr: this.expr() };
    if (this.match('ECHO')) return { type: 'Echo', expr: this.expr() };
    if (this.match('ASSERT')) return { type: 'Assert', expr: this.expr() };
    
    const left = this.tupleExpr();
    if (this.match('COL')) return { type: 'Binding', name: left, value: this.expr() };
    if (this.match('RCOL')) return { type: 'Binding', name: this.tupleExpr(), value: left };
    if (this.match('THEN')) return { type: 'When', pattern: left, result: this.expr() };
    if (this.match('WHEN')) return { type: 'When', pattern: this.tupleExpr(), result: left };
    throw new Error(`Invalid statement`);
  }
  
  valLav() { this.expect('VAL'); const stmts = this.statements(); this.expect('LAV'); return { type: 'ValLav', statements: stmts }; }
  ifFi() { this.expect('IF'); const stmts = this.statements(); this.expect('FI'); return { type: 'IfFi', statements: stmts }; }
}

// ============================================================================
// INTERPRETER: patterns.js
// ============================================================================

const matchPattern = (pattern, value, env) => {
  if (pattern.type === 'Wildcard') return true;
  if (pattern.type === 'Num') return value instanceof CalderNum && value.v === pattern.value;
  if (pattern.type === 'Str') return value instanceof CalderStr && value.s === pattern.value;
  if (pattern.type === 'Id') { env[pattern.name] = value; return true; }
  
  if (pattern.type === 'Tuple') {
    if (!(value instanceof CalderTuple)) return false;
    const envCopy = { ...env };
    if (!matchPattern(pattern.left, value.left, envCopy)) return false;
    if (!matchPattern(pattern.right, value.right, envCopy)) return false;
    Object.assign(env, envCopy);
    return true;
  }
  
  // n+k pattern
  if (pattern.type === 'BinOp' && pattern.op === 'ADD') {
    if (!(value instanceof CalderNum)) return false;
    if (pattern.left.type === 'Id' && pattern.right.type === 'Num') {
      const k = pattern.right.value;
      if (value.v < k) return false;
      env[pattern.left.name] = new CalderNum(value.v - k);
      return true;
    }
  }
  return false;
};

// ============================================================================
// INTERPRETER: evaluator.js
// ============================================================================

const BINARY_OPS = {
  ADD: (a, b) => a + b, SUB: (a, b) => a - b, MUL: (a, b) => a * b, DIV: (a, b) => Math.floor(a / b),
  LT: (a, b) => a < b ? 1 : 0, LE: (a, b) => a <= b ? 1 : 0, GT: (a, b) => a > b ? 1 : 0,
  GE: (a, b) => a >= b ? 1 : 0, EQ: (a, b) => a === b ? 1 : 0, NE: (a, b) => a !== b ? 1 : 0,
};

const evaluate = (node, env, output) => {
  if (node.type === 'Num') return new CalderNum(node.value);
  if (node.type === 'Str') return new CalderStr(node.value);
  if (node.type === 'Id') {
    if (!(node.name in env)) throw new Error(`Undefined: ${node.name}`);
    return env[node.name];
  }
  if (node.type === 'Tuple') return new CalderTuple(evaluate(node.left, env, output), evaluate(node.right, env, output));
  
  if (node.type === 'BinOp') {
    const left = evaluate(node.left, env, output);
    const right = evaluate(node.right, env, output);
    if (!(left instanceof CalderNum) || !(right instanceof CalderNum)) throw new Error('Arithmetic requires numbers');
    return new CalderNum(BINARY_OPS[node.op](left.v, right.v));
  }
  
  if (node.type === 'App') {
    const fn = evaluate(node.fn, env, output);
    if (!(fn instanceof CalderClosure)) throw new Error('Cannot call non-function');
    const arg = node.arg ? evaluate(node.arg, env, output) : null;
    const newEnv = { ...fn.env };
    if (!matchPattern(fn.param, arg, newEnv)) throw new Error('Pattern match failed');
    return evaluate(fn.body, newEnv, output);
  }
  
  if (node.type === 'ValLav') return evaluateValLav(node, env, output);
  if (node.type === 'IfFi') return evaluateIfFi(node, env, output);
  if (node.type === 'Lambda') return new CalderClosure(node.param, node.body, env);
  
  throw new Error(`Unknown node: ${node.type}`);
};

const evaluateValLav = (node, env, output) => {
  const localEnv = { ...env };
  const bindings = {};
  let ofExpr = null;
  
  for (const stmt of node.statements) {
    if (stmt.type === 'Of') ofExpr = stmt.expr;
    else if (stmt.type === 'Binding') {
      let name, value;
      if (stmt.name.type === 'App') {
        name = stmt.name.fn.name;
        value = { type: 'Lambda', param: stmt.name.arg, body: stmt.value };
      } else {
        name = stmt.name.name;
        value = stmt.value;
      }
      bindings[name] = value;
    }
  }
  
  const resolved = new Set();
  const resolve = (name) => {
    if (resolved.has(name) || !(name in bindings)) return;
    const expr = bindings[name];
    if (expr.type === 'Lambda') localEnv[name] = new CalderClosure(expr.param, expr.body, localEnv);
    else localEnv[name] = evaluate(expr, localEnv, output);
    resolved.add(name);
  };
  
  for (let i = 0; i < 10; i++) for (const name in bindings) try { resolve(name); } catch {}
  
  for (const stmt of node.statements) {
    if (stmt.type === 'Echo') output.push(evaluate(stmt.expr, localEnv, output).toString());
    if (stmt.type === 'Assert') {
      const val = evaluate(stmt.expr, localEnv, output);
      if (!(val instanceof CalderNum) || val.v !== 1) throw new Error('Assertion failed');
    }
  }
  
  if (!ofExpr) throw new Error("val...lav must have 'of'");
  return evaluate(ofExpr, localEnv, output);
};

const evaluateIfFi = (node, env, output) => {
  let matchExpr = null;
  const whens = [];
  
  for (const stmt of node.statements) {
    if (stmt.type === 'Match') matchExpr = stmt.expr;
    else if (stmt.type === 'When') whens.push(stmt);
    else if (stmt.type === 'Echo') output.push(evaluate(stmt.expr, env, output).toString());
    else if (stmt.type === 'Assert') {
      const val = evaluate(stmt.expr, env, output);
      if (!(val instanceof CalderNum) || val.v !== 1) throw new Error('Assertion failed');
    }
  }
  
  if (!matchExpr) throw new Error("if...fi must have 'match'");
  const subject = evaluate(matchExpr, env, output);
  
  for (const when of whens) {
    const newEnv = { ...env };
    if (matchPattern(when.pattern, subject, newEnv)) return evaluate(when.result, newEnv, output);
  }
  throw new Error('No pattern matched');
};

// ============================================================================
// INTERPRETER: index.js
// ============================================================================

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

const analyzeAST = (node, depth = 0) => {
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

const analyzeStatement = (stmt, index, depth) => {
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

// ============================================================================
// MOBILE: permutations.js
// ============================================================================

const factorial = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const calculatePermutations = (node) => {
  if (!node) return { orderings: 1, flips: 1, total: 1 };
  let orderings = 1, flips = 1;
  if (node.reorderable && node.children?.length > 1) orderings *= factorial(node.children.length);
  if (node.flippable) flips *= 2;
  if (node.children) for (const c of node.children) { const p = calculatePermutations(c); orderings *= p.orderings; flips *= p.flips; }
  return { orderings, flips, total: orderings * flips };
};

const initMobileState = (structure) => {
  const orders = {}, flips = {};
  const walk = (node, path = 'root') => {
    if (!node) return;
    if (node.reorderable && node.children) orders[path] = node.children.map((_, i) => i);
    if (node.flippable) flips[path] = false;
    if (node.children) node.children.forEach((c, i) => walk(c, `${path}.${i}`));
  };
  walk(structure);
  return { orders, flips };
};

const randomizeMobileState = (orders, flips) => {
  const newOrders = {}, newFlips = {};
  for (const k in orders) newOrders[k] = shuffle([...orders[k]]);
  for (const k in flips) newFlips[k] = Math.random() > 0.5;
  return { orders: newOrders, flips: newFlips };
};

// ============================================================================
// HOOKS: useInterpreter.js
// ============================================================================

const useInterpreter = () => {
  const [output, setOutput] = useState([]);
  const [ast, setAst] = useState(null);
  
  const run = useCallback((code) => {
    const result = runCalder(code);
    setOutput(result.output);
    setAst(result.ast);
    return result;
  }, []);
  
  const clear = useCallback(() => { setOutput([]); setAst(null); }, []);
  
  return { run, clear, output, ast, hasOutput: output.length > 0 };
};

// ============================================================================
// HOOKS: useMobile.js
// ============================================================================

const useMobile = (ast) => {
  const [orders, setOrders] = useState({});
  const [flips, setFlips] = useState({});
  const [shakeCount, setShakeCount] = useState(0);
  
  const structure = useMemo(() => ast ? analyzeAST(ast) : null, [ast]);
  const permutations = useMemo(() => structure ? calculatePermutations(structure) : { orderings: 0, flips: 0, total: 0 }, [structure]);
  
  useEffect(() => {
    if (structure) {
      const { orders: o, flips: f } = initMobileState(structure);
      setOrders(o); setFlips(f); setShakeCount(1);
    } else {
      setOrders({}); setFlips({}); setShakeCount(0);
    }
  }, [structure]);
  
  const shake = useCallback(() => {
    const { orders: o, flips: f } = randomizeMobileState(orders, flips);
    setOrders(o); setFlips(f); setShakeCount(c => c + 1);
  }, [orders, flips]);
  
  return { structure, orders, flips, permutations, shakeCount, shake, hasMobile: !!structure };
};

// ============================================================================
// COMPONENTS: MobileRenderer.jsx
// ============================================================================

const truncate = (str, len) => (!str ? '' : str.length > len ? str.slice(0, len - 1) + '…' : str);

const MobileNode = ({ node, x, y, width, path, orders, flips }) => {
  if (!node) return null;
  
  const isFlipped = flips[path] || false;
  const order = orders[path] || node.children?.map((_, i) => i) || [];
  const color = getNodeColor(node.type);
  
  // Block with children
  if ((node.type === 'vallav' || node.type === 'iffi') && node.children?.length > 0) {
    const childCount = node.children.length;
    const childWidth = Math.min(120, (width - 40) / childCount);
    const totalW = childWidth * childCount;
    const startX = x - totalW / 2 + childWidth / 2;
    
    return (
      <g>
        <line x1={x - totalW/2 - 20} y1={y} x2={x + totalW/2 + 20} y2={y} stroke={color} strokeWidth="3"/>
        <circle cx={x} cy={y} r="4" fill={color}/>
        <text x={x} y={y - 10} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">{node.label}</text>
        {order.map((ci, pi) => {
          const child = node.children[ci];
          if (!child) return null;
          const cx = startX + pi * childWidth;
          const cp = `${path}.${ci}`;
          return (
            <g key={cp}>
              <line x1={cx} y1={y} x2={cx} y2={y + 30} stroke={color} strokeWidth="1.5"/>
              <MobileNode node={child} x={cx} y={y + 40} width={childWidth * 0.9} path={cp} orders={orders} flips={flips}/>
            </g>
          );
        })}
      </g>
    );
  }
  
  // When clause
  if (node.type === 'when') {
    const arrow = isFlipped ? '←' : '→';
    const leftLabel = isFlipped ? truncate(node.result, 10) : truncate(node.pattern, 10);
    const rightLabel = isFlipped ? truncate(node.pattern, 10) : truncate(node.result, 10);
    return (
      <g>
        <line x1={x - 35} y1={y} x2={x + 35} y2={y} stroke={color} strokeWidth="2"/>
        <circle cx={x} cy={y} r="3" fill={color}/>
        <text x={x} y={y - 6} textAnchor="middle" fill={color} fontSize="9" fontFamily="monospace">{arrow}</text>
        <line x1={x - 25} y1={y} x2={x - 25} y2={y + 20} stroke={color} strokeWidth="1.5"/>
        <g transform={`translate(${x - 25}, ${y + 35})`}>
          <ellipse cx="0" cy="0" rx="30" ry="14" fill={color} opacity="0.9"/>
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace">{leftLabel}</text>
        </g>
        <line x1={x + 25} y1={y} x2={x + 25} y2={y + 20} stroke={color} strokeWidth="1.5"/>
        <g transform={`translate(${x + 25}, ${y + 35})`}>
          <ellipse cx="0" cy="0" rx="30" ry="14" fill={color} opacity="0.9"/>
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace">{rightLabel}</text>
        </g>
      </g>
    );
  }
  
  // Binding with nested
  if (node.type === 'binding' && node.children?.length > 0) {
    return (
      <g>
        <g transform={`translate(${x}, ${y})`}>
          <rect x="-50" y="-12" width="100" height="24" rx="4" fill={color} opacity="0.9"/>
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">{truncate(node.name, 12)}</text>
        </g>
        <line x1={x} y1={y + 12} x2={x} y2={y + 35} stroke={color} strokeWidth="1.5"/>
        <MobileNode node={node.children[0]} x={x} y={y + 50} width={width} path={`${path}.nested`} orders={orders} flips={flips}/>
      </g>
    );
  }
  
  // Simple leaf
  const label = (node.flippable && isFlipped && node.labelFlipped) ? node.labelFlipped : node.label;
  const isEllipse = ['of', 'match', 'echo', 'assert'].includes(node.type);
  return (
    <g transform={`translate(${x}, ${y})`}>
      {isEllipse 
        ? <ellipse cx="0" cy="0" rx="45" ry="18" fill={color} opacity="0.9"/>
        : <rect x="-45" y="-14" width="90" height="28" rx="4" fill={color} opacity="0.9"/>}
      <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">{truncate(label, 14)}</text>
    </g>
  );
};

const MobileRenderer = ({ structure, orders, flips, shakeCount, totalPerms }) => {
  if (!structure) return null;
  return (
    <svg viewBox="0 0 500 300" className="w-full h-64 bg-slate-900 rounded">
      <circle cx="250" cy="20" r="4" fill="#f97316"/>
      <line x1="250" y1="20" x2="250" y2="50" stroke="#f97316" strokeWidth="2"/>
      <MobileNode node={structure} x={250} y={60} width={400} path="root" orders={orders} flips={flips}/>
      <text x="250" y="290" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        Shake #{shakeCount} • {totalPerms.toLocaleString()} permutations
      </text>
    </svg>
  );
};

// ============================================================================
// COMPONENTS: UI Components
// ============================================================================

const TabSwitcher = ({ activeTab, onTabChange, tabs }) => (
  <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
    {tabs.map(({ id, label }) => (
      <button key={id} onClick={() => onTabChange(id)}
        className={`px-4 py-2 rounded-md font-mono text-sm transition-all ${activeTab === id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>
        {label}
      </button>
    ))}
  </div>
);

const CodeEditor = ({ code, onChange, onRun, onExampleSelect }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-2">
      <span className="text-slate-500 text-sm font-mono py-1">Examples:</span>
      {Object.keys(examples).map(name => (
        <button key={name} onClick={() => { onChange(examples[name]); onExampleSelect?.(); }}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-mono rounded transition-all">
          {name}
        </button>
      ))}
    </div>
    <textarea value={code} onChange={e => onChange(e.target.value)}
      className="w-full h-64 bg-slate-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-slate-700 focus:border-orange-500 focus:outline-none resize-none"
      spellCheck={false} placeholder="Write your Calder code here..."/>
    <button onClick={onRun}
      className="px-6 py-3 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-mono font-bold rounded-lg shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Run
    </button>
  </div>
);

const OutputPanel = ({ output }) => {
  if (!output?.length) return null;
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-slate-500 text-xs mb-2 font-mono">Output:</div>
      <pre className="text-cyan-400 font-mono text-sm whitespace-pre-wrap">{output.join('\n')}</pre>
    </div>
  );
};

const MobileView = ({ mobile }) => {
  if (!mobile.hasMobile) return null;
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <div className="text-slate-500 text-xs font-mono">Mobile Visualization</div>
        <button onClick={mobile.shake}
          className="px-3 py-1 bg-orange-500 hover:bg-orange-400 text-white text-xs font-mono rounded transition-all flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Shake
        </button>
      </div>
      <MobileRenderer structure={mobile.structure} orders={mobile.orders} flips={mobile.flips} shakeCount={mobile.shakeCount} totalPerms={mobile.permutations.total}/>
    </div>
  );
};

const SyntaxRef = () => {
  const items = [
    ['val...lav', 'define bindings'], ['if...fi', 'pattern match'],
    ['of expr', 'return value'], ['match expr', 'match subject'],
    ['name: expr', 'binding'], ['pat → expr', 'clause'],
    ['f(x): expr', 'function'], ['m+1', 'successor pattern'],
    ['_', 'wildcard'], ['!', 'statement separator'],
  ];
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-slate-500 text-xs mb-2 font-mono">Quick Reference:</div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
        {items.map(([syn, desc]) => <div key={syn}><span className="text-orange-400">{syn}</span> — {desc}</div>)}
      </div>
    </div>
  );
};

// ============================================================================
// APP
// ============================================================================

export default function CalderMobile() {
  const [code, setCode] = useState(examples.factorial);
  const interpreter = useInterpreter();
  const mobile = useMobile(interpreter.ast);
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-slate-900 min-h-screen">
      <h1 className="text-xl font-mono text-orange-500">Calder Mobile</h1>
      
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <CodeEditor 
          code={code} 
          onChange={setCode} 
          onRun={() => interpreter.run(code)} 
          onExampleSelect={interpreter.clear}
        />
        <OutputPanel output={interpreter.output}/>
        <MobileView mobile={mobile}/>
        <SyntaxRef/>
      </div>
    </div>
  );
}
