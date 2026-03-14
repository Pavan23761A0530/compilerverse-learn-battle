// === Compiler simulation logic ===

export interface Token {
  type: "Keyword" | "Identifier" | "Operator" | "Number" | "Symbol" | "String" | "Unknown";
  value: string;
}

const KEYWORDS = new Set(["int", "float", "double", "char", "void", "return", "if", "else", "while", "for", "do", "break", "continue", "struct", "string"]);

/** Lexical Analysis: tokenize C-like code */
export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const src = code.trim();

  while (i < src.length) {
    // Skip whitespace
    if (/\s/.test(src[i])) { i++; continue; }

    // String literal
    if (src[i] === '"') {
      let str = '"';
      i++;
      while (i < src.length && src[i] !== '"') { str += src[i]; i++; }
      if (i < src.length) { str += '"'; i++; }
      tokens.push({ type: "String", value: str });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(src[i])) {
      let num = "";
      while (i < src.length && /[0-9.]/.test(src[i])) { num += src[i]; i++; }
      tokens.push({ type: "Number", value: num });
      continue;
    }

    // Identifiers / Keywords
    if (/[a-zA-Z_]/.test(src[i])) {
      let id = "";
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) { id += src[i]; i++; }
      tokens.push({ type: KEYWORDS.has(id) ? "Keyword" : "Identifier", value: id });
      continue;
    }

    // Operators
    if ("=+-*/<>!&|".includes(src[i])) {
      let op = src[i]; i++;
      if (i < src.length && "=&|".includes(src[i])) { op += src[i]; i++; }
      tokens.push({ type: "Operator", value: op });
      continue;
    }

    // Symbols
    if (";,(){}[]".includes(src[i])) {
      tokens.push({ type: "Symbol", value: src[i] });
      i++;
      continue;
    }

    tokens.push({ type: "Unknown", value: src[i] });
    i++;
  }
  return tokens;
}

/** Parse tree node */
export interface TreeNode {
  label: string;
  children: TreeNode[];
}

/** Syntax Analysis: build a simple parse tree for assignments like `int a = 5 + 3;` */
export function buildParseTree(tokens: Token[]): TreeNode | null {
  // Find assignment operator
  const eqIdx = tokens.findIndex(t => t.value === "=");
  if (eqIdx === -1) return { label: tokens.map(t => t.value).join(" "), children: [] };

  const lhs = tokens.slice(0, eqIdx).filter(t => t.type === "Identifier")[0];
  const rhs = tokens.slice(eqIdx + 1).filter(t => t.type !== "Symbol");

  // Check for binary operation
  const opIdx = rhs.findIndex(t => t.type === "Operator");
  if (opIdx !== -1 && rhs.length >= 3) {
    return {
      label: "=",
      children: [
        { label: lhs?.value || "?", children: [] },
        {
          label: rhs[opIdx].value,
          children: [
            { label: rhs[0].value, children: [] },
            { label: rhs[2]?.value || "?", children: [] },
          ],
        },
      ],
    };
  }

  return {
    label: "=",
    children: [
      { label: lhs?.value || "?", children: [] },
      { label: rhs[0]?.value || "?", children: [] },
    ],
  };
}

/** Semantic Analysis */
export interface SemanticResult {
  success: boolean;
  messages: { type: "success" | "error"; text: string }[];
}

export function semanticAnalysis(code: string, tokens: Token[]): SemanticResult {
  const messages: SemanticResult["messages"] = [];
  const declared = new Set<string>();

  // Simple checks
  const keywords = tokens.filter(t => t.type === "Keyword");
  const identifiers = tokens.filter(t => t.type === "Identifier");

  // Track declarations
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === "Keyword" && KEYWORDS.has(tokens[i].value) && tokens[i + 1]?.type === "Identifier") {
      const name = tokens[i + 1].value;
      if (declared.has(name)) {
        messages.push({ type: "error", text: `Duplicate declaration: '${name}'` });
      } else {
        declared.add(name);
        messages.push({ type: "success", text: `Variable '${name}' declared as ${tokens[i].value}` });
      }
    }
  }

  // Type check: string assigned to int
  if (keywords.some(k => k.value === "int") && tokens.some(t => t.type === "String")) {
    messages.push({ type: "error", text: "Type mismatch: cannot assign string to int" });
  }

  if (messages.length === 0) {
    messages.push({ type: "success", text: "No semantic errors found" });
  }

  return { success: messages.every(m => m.type === "success"), messages };
}

/** IR: Three Address Code */
export function generateIR(tokens: Token[]): string[] {
  const lines: string[] = [];
  const eqIdx = tokens.findIndex(t => t.value === "=");
  if (eqIdx === -1) return ["// No assignment found"];

  const lhs = tokens.slice(0, eqIdx).filter(t => t.type === "Identifier")[0];
  const rhs = tokens.slice(eqIdx + 1).filter(t => t.type !== "Symbol");
  const opIdx = rhs.findIndex(t => t.type === "Operator");

  if (opIdx !== -1 && rhs.length >= 3) {
    lines.push(`t1 = ${rhs[0].value} ${rhs[opIdx].value} ${rhs[2]?.value || "?"}`);
    lines.push(`${lhs?.value || "?"} = t1`);
  } else {
    lines.push(`${lhs?.value || "?"} = ${rhs[0]?.value || "?"}`);
  }
  return lines;
}

/** Code Optimization: constant folding */
export function optimize(irLines: string[]): { lines: string[]; applied: string[] } {
  const applied: string[] = [];
  const optimized = irLines.map(line => {
    // Constant folding: detect `t1 = num op num`
    const match = line.match(/^(\w+)\s*=\s*(\d+)\s*([+\-*/])\s*(\d+)$/);
    if (match) {
      const [, varName, a, op, b] = match;
      let result: number;
      switch (op) {
        case "+": result = +a + +b; break;
        case "-": result = +a - +b; break;
        case "*": result = +a * +b; break;
        case "/": result = +b !== 0 ? Math.floor(+a / +b) : 0; break;
        default: return line;
      }
      applied.push("Constant Folding");
      return `${varName} = ${result}`;
    }
    return line;
  });

  // Dead code elimination: remove temp vars that were folded
  const finalLines: string[] = [];
  for (let i = 0; i < optimized.length; i++) {
    const assignMatch = optimized[i].match(/^(t\d+)\s*=\s*(\d+)$/);
    if (assignMatch) {
      // Check if this temp is used later
      const tempName = assignMatch[1];
      const usedLater = optimized.slice(i + 1).some(l => l.includes(tempName));
      if (usedLater) {
        // Replace usage with value
        const val = assignMatch[2];
        for (let j = i + 1; j < optimized.length; j++) {
          optimized[j] = optimized[j].replace(new RegExp(`\\b${tempName}\\b`, "g"), val);
        }
        applied.push("Copy Propagation");
        continue; // skip this line
      }
    }
    finalLines.push(optimized[i]);
  }

  return { lines: finalLines.length > 0 ? finalLines : optimized, applied: [...new Set(applied)] };
}
