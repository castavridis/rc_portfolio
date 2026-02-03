// Calder Runtime Values

export class CalderNum {
  constructor(v) { 
    this.v = v; 
  }
  toString() { 
    return String(this.v); 
  }
}

export class CalderStr {
  constructor(s) { 
    this.s = s; 
  }
  toString() { 
    return `"${this.s}"`; 
  }
}

export class CalderTuple {
  constructor(left, right) { 
    this.left = left; 
    this.right = right; 
  }
  toString() { 
    return `(${this.left}, ${this.right})`; 
  }
}

export class CalderClosure {
  constructor(param, body, env) {
    this.param = param;
    this.body = body;
    this.env = env;
  }
  toString() { 
    return `<function>`; 
  }
}
