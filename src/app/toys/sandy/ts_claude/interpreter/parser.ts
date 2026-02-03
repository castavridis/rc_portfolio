
// ============================================================================
// INTERPRETER: parser.js
// ============================================================================

export class Parser {
  tokens
  pos
  
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