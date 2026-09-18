// Safe expression evaluator — allowlist tokenizer + recursive descent.
// NEVER uses eval/new Function (see CVE-2026-12866 expr-eval RCE via
// toJSFunction). Worst case for hostile input is "Error", never code exec.
// Verified 2026 pattern: whitelist alphabet, length cap, explicit arithmetic.
export function safeEval(input: string): string {
  const expr = input.replace(/\s+/g, "");
  if (!expr) return "";
  if (expr.length > 100) return "Error";
  // Closed alphabet: digits, operators, parens, dot, %, ^, !, letters for
  // whitelisted functions/constants only (sqrt sin cos tan log ln pi e).
  if (!/^[0-9+\-*/.()%^!a-zπ]*$/i.test(expr)) return "Error";
  try {
    const tokens = tokenize(expr);
    const parser = new Parser(tokens);
    const v = parser.parseExpr();
    if (parser.pos !== tokens.length) return "Error";
    if (typeof v !== "number" || !Number.isFinite(v)) return "Error";
    return String(Math.round(v * 1e10) / 1e10);
  } catch {
    return "Error";
  }
}

type Tok = { t: "num"; v: number } | { t: "op"; v: string } | { t: "fn"; v: string } | { t: "const"; v: string };

function tokenize(s: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const fns = ["sqrt", "sin", "cos", "tan", "log", "ln"];
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const raw = s.slice(i, j);
      if ((raw.match(/\./g) ?? []).length > 1) throw new Error("bad number");
      out.push({ t: "num", v: parseFloat(raw) });
      i = j;
    } else if (c === "π") {
      out.push({ t: "const", v: "pi" });
      i++;
    } else if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      const word = s.slice(i, j).toLowerCase();
      if (fns.includes(word)) out.push({ t: "fn", v: word });
      else if (word === "e") out.push({ t: "const", v: "e" });
      else if (word === "pi") out.push({ t: "const", v: "pi" });
      else throw new Error(`unknown ${word}`);
      i = j;
    } else if ("+-*/%^!()".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
    } else {
      throw new Error(`bad char ${c}`);
    }
  }
  return out;
}

const fact = (n: number): number => {
  if (!Number.isInteger(n) || n < 0 || n > 20) throw new Error("bad fact");
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};

class Parser {
  pos = 0;
  tokens: Tok[];
  constructor(tokens: Tok[]) {
    this.tokens = tokens;
  }
  peek(): Tok | undefined {
    return this.tokens[this.pos];
  }
  eat(op: string): boolean {
    const t = this.peek();
    if (t?.t === "op" && t.v === op) {
      this.pos++;
      return true;
    }
    return false;
  }
  parseExpr(): number {
    let v = this.parseTerm();
    for (;;) {
      if (this.eat("+")) v += this.parseTerm();
      else if (this.eat("-")) v -= this.parseTerm();
      else return v;
    }
  }
  parseTerm(): number {
    let v = this.parseFactor();
    for (;;) {
      if (this.eat("*")) v *= this.parseFactor();
      else if (this.eat("/")) {
        const d = this.parseFactor();
        if (d === 0) throw new Error("div0");
        v /= d;
      } else if (this.eat("%")) {
        v /= 100;
      } else return v;
    }
  }
  parseFactor(): number {
    let v = this.parseUnary();
    if (this.eat("^")) {
      const e = this.parseFactor();
      v = Math.pow(v, e);
    }
    if (this.eat("!")) v = fact(v);
    return v;
  }
  parseUnary(): number {
    if (this.eat("-")) return -this.parseUnary();
    if (this.eat("+")) return this.parseUnary();
    return this.parsePrimary();
  }
  parsePrimary(): number {
    const t = this.peek();
    if (!t) throw new Error("eof");
    if (t.t === "num") {
      this.pos++;
      return t.v;
    }
    if (t.t === "const") {
      this.pos++;
      return t.v === "pi" ? Math.PI : Math.E;
    }
    if (t.t === "fn") {
      this.pos++;
      if (!this.eat("(")) throw new Error("expect (");
      const v = this.parseExpr();
      if (!this.eat(")")) throw new Error("expect )");
      switch (t.v) {
        case "sqrt":
          if (v < 0) throw new Error("sqrt");
          return Math.sqrt(v);
        case "sin": return Math.sin(v);
        case "cos": return Math.cos(v);
        case "tan": return Math.tan(v);
        case "log":
          if (v <= 0) throw new Error("log");
          return Math.log10(v);
        case "ln":
          if (v <= 0) throw new Error("ln");
          return Math.log(v);
        default: throw new Error("fn");
      }
    }
    if (t.t === "op" && t.v === "(") {
      this.pos++;
      const v = this.parseExpr();
      if (!this.eat(")")) throw new Error("expect )");
      return v;
    }
    throw new Error("primary");
  }
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
