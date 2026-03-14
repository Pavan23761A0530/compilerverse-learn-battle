import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Zap, ChevronRight, RotateCcw } from "lucide-react";
import { getShuffledQuestions, type Question } from "@/lib/questions";

const TIMER_DURATION = 15;

const QuizBattle = ({ onComplete }: { onComplete: (score: number, total: number) => void }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameState, setGameState] = useState<"idle" | "playing" | "done">("idle");
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = () => {
    const qs = getShuffledQuestions(15);
    setQuestions(qs);
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(TIMER_DURATION);
    setGameState("playing");
    setFlash(null);
  };

  const nextQuestion = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      setGameState("done");
      onComplete(score, questions.length);
      return;
    }
    setCurrentIdx(prev => prev + 1);
    setSelected(null);
    setTimeLeft(TIMER_DURATION);
    setFlash(null);
  }, [currentIdx, questions.length, score, onComplete]);

  const selectAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === questions[currentIdx].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFlash("correct");
    } else {
      setFlash("wrong");
    }
    setTimeout(nextQuestion, 1200);
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFlash("wrong");
          setTimeout(nextQuestion, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, currentIdx, nextQuestion]);

  const circumference = 2 * Math.PI * 45;
  const progress = (timeLeft / TIMER_DURATION) * circumference;

  if (gameState === "idle") {
    return (
      <section id="quiz" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold neon-text mb-2">
              Quiz <span className="text-primary">Battle Mode</span>
            </h2>
            <p className="text-muted-foreground font-body mb-8">15 questions • 15 seconds each • Test your compiler knowledge</p>
            <button onClick={startGame} className="neon-btn text-sm inline-flex items-center gap-2">
              <Zap className="w-4 h-4" /> Start Battle
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  if (gameState === "done") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <section id="quiz" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Trophy className="w-16 h-16 text-neon-orange mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Battle Complete!</h2>
            <p className="font-display text-5xl font-black text-primary mb-2">{score}/{questions.length}</p>
            <p className="text-muted-foreground font-body mb-6">{pct}% accuracy</p>
            <button onClick={startGame} className="neon-btn text-sm inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  const q = questions[currentIdx];

  return (
    <section id="quiz" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-xs text-muted-foreground">Q{currentIdx + 1}/{questions.length}</span>
            <span className="font-display text-sm text-primary font-bold">Score: {score}</span>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={timeLeft <= 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                className="transition-all duration-1000 linear"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center font-display text-sm font-bold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Flash overlay */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-40 pointer-events-none ${flash === "correct" ? "bg-neon-green" : "bg-destructive"}`}
            />
          )}
        </AnimatePresence>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass-card-strong p-6"
          >
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">{q.topic}</span>
            <h3 className="font-body text-lg font-bold text-foreground mt-2 mb-6">{q.question}</h3>
            <div className="grid gap-3">
              {q.options.map((opt, i) => {
                let cls = "glass-card p-4 text-sm font-body font-medium text-foreground cursor-pointer hover:border-primary/50 transition-all";
                if (selected !== null) {
                  if (i === q.answer) cls = "p-4 text-sm font-body font-bold border rounded-lg bg-neon-green/10 border-neon-green/50 text-neon-green";
                  else if (i === selected) cls = "p-4 text-sm font-body font-bold border rounded-lg bg-destructive/10 border-destructive/50 text-destructive";
                  else cls = "glass-card p-4 text-sm font-body text-muted-foreground opacity-50";
                }
                return (
                  <motion.button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    className={cls}
                    disabled={selected !== null}
                  >
                    <span className="font-display text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default QuizBattle;
