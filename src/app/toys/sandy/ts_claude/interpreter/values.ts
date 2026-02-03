// ============================================================================
// INTERPRETER: values.js
// ============================================================================

export class CalderNum {
  v
  constructor(v) { this.v = v; }
  toString() { return String(this.v); }
}

export class CalderStr {
  s
  constructor(s) { this.s = s; }
  toString() { return `"${this.s}"`; }
}

export class CalderTuple {
  left
  right
  constructor(left, right) { this.left = left; this.right = right; }
  toString() { return `(${this.left}, ${this.right})`; }
}

export class CalderClosure {
  param
  body
  env
  constructor(param, body, env) { this.param = param; this.body = body; this.env = env; }
  toString() { return '<function>'; }
}