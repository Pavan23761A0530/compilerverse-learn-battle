import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, X, RotateCcw } from "lucide-react";

interface ErrorCase {
  code: string;
  errorType: string;
  explanation: string;
}

const ERROR_CASES: ErrorCase[] = [
  { code: 'int 123abc = 5;', errorType: "Lexical Error", explanation: "Identifiers cannot start with a digit. '123abc' is an invalid token." },
  { code: 'int a = 5 +;', errorType: "Syntax Error", explanation: "Missing operand after '+'. The expression is grammatically incorrect." },
  { code: 'int a = "hello";', errorType: "Semantic Error", explanation: "Type mismatch: cannot assign a string literal to an integer variable." },
  { code: 'int a = 5 / 0;', errorType: "Logical Error", explanation: "Division by zero will cause a runtime error. The code is syntactically valid." },
  { code: 'int a = 5;\nint a = 10;', errorType: "Semantic Error", explanation: "Duplicate declaration of variable 'a' in the same scope." },
  { code: 'int a = @5;', errorType: "Lexical Error", explanation: "'@' is not a valid character in C. The lexer cannot recognize this symbol." },
  { code: 'int a = (5 + 3;', errorType: "Syntax Error", explanation: "Missing closing parenthesis. Unbalanced brackets are a syntax error." },
  { code: 'float x = 5;\nint y = x + 1;', errorType: "Semantic Error", explanation: "Implicit narrowing conversion from float to int may cause data loss." },
  { code: 'if(x > 5) { y = 1; } else { y = 1; }', errorType: "Logical Error", explanation: "Both branches produce the same result, making the condition meaningless." },
  { code: 'int a = 5 $ 3;', errorType: "Lexical Error", explanation: "'$' is not a valid operator in C. The lexer cannot tokenize this." },
];

const ERROR_TYPES = ["Lexical Error", "Syntax Error", "Semantic Error", "Logical Error"];

const ErrorDetective = () => {
  const [caseIdx, setCaseIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const current = ERROR_CASES[caseIdx];
  const isCorrect = selected === current.errorType;

  const checkAnswer = () => {
    if (!selected) return;
    setChecked(true);
    setTotal(prev => prev + 1);
    if (isCorrect) setScore(prev => prev + 1);
  };

  const next = () => {
    setCaseIdx((caseIdx + 1) % ERROR_CASES.length);
    setSelected(null);
    setChecked(false);
  };

  return (
    <section id="detective" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center neon-text mb-2">
            Error <span className="text-primary">Detective</span>
          </h2>
          <p className="text-center text-muted-foreground font-body mb-2">Identify the type of error in each code snippet</p>
          <p className="text-center font-display text-sm text-primary mb-10">Score: {score}/{total}</p>
        </motion.div>

        <div className="glass-card-strong p-6 mb-6">
          <label className="text-xs font-display text-muted-foreground uppercase tracking-widest mb-3 block flex items-center gap-2">
            <Search className="w-3 h-3" /> Inspect This Code
          </label>
          <pre className="bg-background/50 rounded-lg p-4 font-mono-code text-sm text-neon-orange whitespace-pre-wrap">
            {current.code}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {ERROR_TYPES.map((type) => (
            <motion.button
              key={type}
              onClick={() => { if (!checked) setSelected(type); }}
              whileHover={!checked ? { scale: 1.03 } : {}}
              whileTap={!checked ? { scale: 0.97 } : {}}
              className={`glass-card p-4 text-sm font-body font-semibold transition-all ${
                checked && type === current.errorType
                  ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                  : checked && type === selected && !isCorrect
                  ? "border-destructive/50 bg-destructive/10 text-destructive"
                  : selected === type
                  ? "border-primary/50 text-primary"
                  : "text-foreground hover:border-primary/30"
              }`}
              disabled={checked}
            >
              {type}
            </motion.button>
          ))}
        </div>

        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 mb-6 flex items-start gap-3 ${isCorrect ? "border-neon-green/30" : "border-destructive/30"}`}
          >
            {isCorrect ? <Check className="w-5 h-5 text-neon-green mt-0.5" /> : <X className="w-5 h-5 text-destructive mt-0.5" />}
            <div>
              <p className={`font-display text-sm font-bold ${isCorrect ? "text-neon-green" : "text-destructive"}`}>
                {isCorrect ? "Correct!" : `Wrong! It's a ${current.errorType}`}
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">{current.explanation}</p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-3 justify-center">
          {!checked ? (
            <button onClick={checkAnswer} className="neon-btn text-sm inline-flex items-center gap-2" disabled={!selected}>
              <Check className="w-4 h-4" /> Check
            </button>
          ) : (
            <button onClick={next} className="neon-btn neon-btn-cyan text-sm inline-flex items-center gap-2">
              Next Snippet <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ErrorDetective;
