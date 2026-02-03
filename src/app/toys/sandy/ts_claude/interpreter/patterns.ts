// ============================================================================
// INTERPRETER: patterns.js
// ============================================================================

import { CalderNum, CalderStr, CalderTuple } from './values';

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

export default matchPattern