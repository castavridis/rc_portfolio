// ============================================================================
// INTERPRETER: evaluator.js
// ============================================================================

import matchPattern from './patterns';
import { CalderClosure, CalderNum, CalderStr, CalderTuple } from './values';

const BINARY_OPS = {
  ADD: (a, b) => a + b, 
  SUB: (a, b) => a - b, 
  MUL: (a, b) => a * b, 
  DIV: (a, b) => Math.floor(a / b),
  LT: (a, b) => a < b ? 1 : 0, 
  LE: (a, b) => a <= b ? 1 : 0, 
  GT: (a, b) => a > b ? 1 : 0,
  GE: (a, b) => a >= b ? 1 : 0, 
  EQ: (a, b) => a === b ? 1 : 0, 
  NE: (a, b) => a !== b ? 1 : 0,
};

export const evaluate = (node, env, output) => {
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
