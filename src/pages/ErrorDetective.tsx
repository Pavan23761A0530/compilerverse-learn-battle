import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, X, RotateCcw, Zap } from "lucide-react";
import { getCurrentPlayer, updateScore } from "@/lib/score-manager";
import { getShuffledErrors, ERROR_TYPES, type ErrorCase } from "@/lib/error-cases";
import PageLayout from "@/components/PageLayout";

const ErrorDetectivePage = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<ErrorCase[]>([]);
  const [caseIdx, setCaseIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => { if (!getCurrentPlayer()) navigate("/"); }, [navigate]);
  useEffect(() => { setCases(getShuffledErrors()); }, []);

  if (cases.length === 0) return null;

  const current = cases[caseIdx % cases.length];
  const isCorrect = selected === current.errorType;

  const checkAnswer = () => {
    if (!selected) return;
    setChecked(true);
    setTotal(prev => prev + 1);
    const delta = isCorrect ? 150 : -50;
    setScore(prev => prev + delta);
    updateScore("errorDetective", delta);
  };

  const next = () => {
    if (caseIdx + 1 >= cases.length) {
      setCases(getShuffledErrors());
      setCaseIdx(0);
    } else {
      setCaseIdx(prev => prev + 1);
    }
    setSelected(null);
    setChecked(false);
  };

  return (
    <PageLayout title="Error Detective">
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center neon-text mb-2">
              <Search className="inline w-7 h-7 text-primary mr-2" />
              Error <span className="text-primary">Detective</span>
            </h2>
            <div className="flex justify-center gap-6 mb-8">
              <p className="font-display text-xs text-muted-foreground">Solved: {total}</p>
              <p className="font-display text-xs text-primary">Score: {score}</p>
              <p className="font-body text-xs text-muted-foreground">+150 / −50</p>
            </div>
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

          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-4 mb-6 flex items-start gap-3 ${isCorrect ? "border-neon-green/30" : "border-destructive/30"}`}
              >
                {isCorrect ? <Zap className="w-5 h-5 text-neon-green mt-0.5" /> : <X className="w-5 h-5 text-destructive mt-0.5" />}
                <div>
                  <p className={`font-display text-sm font-bold ${isCorrect ? "text-neon-green" : "text-destructive"}`}>
                    {isCorrect ? "Correct! +150" : `Wrong! It's a ${current.errorType} (−50)`}
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{current.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
    </PageLayout>
  );
};

export default ErrorDetectivePage;
