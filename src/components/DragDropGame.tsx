import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical, Check, X, RotateCcw } from "lucide-react";

const CORRECT_ORDER = [
  "Lexical Analysis",
  "Syntax Analysis",
  "Semantic Analysis",
  "Intermediate Code Generation",
  "Code Optimization",
  "Target Code Generation",
];

const EXPLANATIONS: Record<string, string> = {
  "Lexical Analysis": "Converts source code into tokens (keywords, identifiers, operators, etc.)",
  "Syntax Analysis": "Checks grammatical structure and builds a parse tree from tokens.",
  "Semantic Analysis": "Validates meaning: type checking, scope resolution, undeclared variables.",
  "Intermediate Code Generation": "Produces machine-independent intermediate representation (three-address code).",
  "Code Optimization": "Improves IR for efficiency: constant folding, dead code elimination, loop optimization.",
  "Target Code Generation": "Translates optimized IR into target machine code or assembly.",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DragDropGame = () => {
  const [items, setItems] = useState(() => shuffle(CORRECT_ORDER));
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set());

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newItems = [...items];
    const [removed] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, removed);
    setItems(newItems);
    setDragIdx(idx);
  };

  const handleDragEnd = () => setDragIdx(null);

  const checkOrder = () => {
    const isCorrect = items.every((item, i) => item === CORRECT_ORDER[i]);
    setCorrect(isCorrect);
    setChecked(true);
    if (!isCorrect) {
      const wrong = new Set<number>();
      items.forEach((item, i) => { if (item !== CORRECT_ORDER[i]) wrong.add(i); });
      setWrongIndices(wrong);
    }
  };

  const reset = () => {
    setItems(shuffle(CORRECT_ORDER));
    setChecked(false);
    setCorrect(false);
    setWrongIndices(new Set());
  };

  return (
    <section id="dragdrop" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center neon-text mb-2">
            Arrange the <span className="text-primary">Compiler Phases</span>
          </h2>
          <p className="text-center text-muted-foreground font-body mb-10">Drag and drop the phases in the correct order</p>
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, i)}
              onDragEnd={handleDragEnd}
              layout
              className={`glass-card-strong p-4 flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all ${
                checked && correct ? "border-neon-green/50" : ""
              } ${checked && !correct && wrongIndices.has(i) ? "animate-shake border-destructive/50" : ""
              } ${checked && !correct && !wrongIndices.has(i) ? "border-neon-green/50" : ""}`}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <span className="font-display text-xs text-muted-foreground w-6">{i + 1}.</span>
              <span className="font-body text-sm font-semibold text-foreground flex-1">{item}</span>
              {checked && (
                item === CORRECT_ORDER[i]
                  ? <Check className="w-4 h-4 text-neon-green" />
                  : <X className="w-4 h-4 text-destructive" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <button onClick={checkOrder} className="neon-btn text-sm inline-flex items-center gap-2" disabled={checked && correct}>
            <Check className="w-4 h-4" /> Check Order
          </button>
          <button onClick={reset} className="neon-btn neon-btn-cyan text-sm inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Shuffle
          </button>
        </div>

        {checked && correct && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-3">
            <p className="text-center font-display text-neon-green text-lg">🎉 Perfect Order!</p>
            {CORRECT_ORDER.map((phase, i) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-3 text-xs"
              >
                <span className="font-display text-primary">{phase}:</span>{" "}
                <span className="text-muted-foreground font-body">{EXPLANATIONS[phase]}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DragDropGame;
