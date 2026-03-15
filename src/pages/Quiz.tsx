import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Zap, RotateCcw, ChevronRight, Swords, Lock } from "lucide-react";
import { getCurrentPlayer, updateQuizScore, hasCompletedQuiz, getAdminSettings } from "@/lib/score-manager";
import { getAssessmentQuestions, ASSESSMENTS, type QuizQuestion } from "@/lib/quiz-bank";
import PageLayout from "@/components/PageLayout";

const TIMER_DURATION = 15;
const CORRECT_POINTS = 100;
const WRONG_PENALTY = 25;

const QuizPage = () => {
  const navigate = useNavigate();
  const [assessmentIdx, setAssessmentIdx] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameState, setGameState] = useState<"select" | "playing" | "done">("select");
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const adminSettings = getAdminSettings();

  useEffect(() => { if (!getCurrentPlayer()) navigate("/"); }, [navigate]);

  const startAssessment = (idx: number) => {
    if (!adminSettings.quizActive[idx]) return;
    if (hasCompletedQuiz(idx)) return;
    setAssessmentIdx(idx);
    setQuestions(getAssessmentQuestions(idx));
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
      if (assessmentIdx !== null) updateQuizScore(assessmentIdx, score);
      return;
    }
    setCurrentIdx(prev => prev + 1);
    setSelected(null);
    setTimeLeft(TIMER_DURATION);
    setFlash(null);
  }, [currentIdx, questions.length, score, assessmentIdx]);

  const selectAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === questions[currentIdx].answer;
    if (isCorrect) { setScore(prev => prev + CORRECT_POINTS); setFlash("correct"); }
    else { setScore(prev => Math.max(0, prev - WRONG_PENALTY)); setFlash("wrong"); }
    setTimeout(nextQuestion, 1000);
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setScore(s => Math.max(0, s - WRONG_PENALTY));
          setFlash("wrong");
          setTimeout(nextQuestion, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, currentIdx, nextQuestion]);

  const circumference = 2 * Math.PI * 45;
  const progress = (timeLeft / TIMER_DURATION) * circumference;

  if (gameState === "select") {
    return (
      <PageLayout title="Quiz Battle Arena">
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold neon-text mb-2">
                <Swords className="inline w-7 h-7 text-primary mr-2" />
                Quiz <span className="text-primary">Battle Arena</span>
              </h2>
              <p className="text-muted-foreground font-body text-sm">Choose an assessment • 30 questions • 15 seconds each</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ASSESSMENTS.map((_, i) => {
                const active = adminSettings.quizActive[i];
                const completed = hasCompletedQuiz(i);
                return (
                  <motion.button key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => startAssessment(i)}
                    disabled={!active || completed}
                    className={`glass-card-strong p-6 text-left group transition-all ${
                      !active ? "opacity-50 cursor-not-allowed" : completed ? "opacity-60 cursor-not-allowed border-neon-green/30" : "hover:border-primary/40"
                    }`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-lg font-bold mb-3 group-hover:scale-110 transition-transform">
                      {!active ? <Lock className="w-4 h-4" /> : completed ? "✓" : i + 1}
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground">Assessment {i + 1}</h3>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {!active ? "Not started by admin" : completed ? "Completed" : "30 unique questions"}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (gameState === "done") {
    const maxScore = questions.length * CORRECT_POINTS;
    const pct = Math.round((score / maxScore) * 100);
    let rating = "Beginner";
    if (pct >= 90) rating = "🏆 Compiler Master";
    else if (pct >= 70) rating = "⭐ Advanced";
    else if (pct >= 50) rating = "📘 Intermediate";

    return (
      <PageLayout title="Quiz Battle Arena">
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-md text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Trophy className="w-16 h-16 text-neon-orange mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Assessment {(assessmentIdx ?? 0) + 1} Complete!</h2>
              <p className="font-display text-4xl font-black text-primary mb-1">{score}</p>
              <p className="text-muted-foreground font-body text-sm mb-1">out of {maxScore} points</p>
              <p className="font-display text-lg text-neon-cyan mb-6">{rating}</p>
              <button onClick={() => navigate("/home")} className="neon-btn text-sm inline-flex items-center gap-2">
                <ChevronRight className="w-4 h-4" /> Back to Home
              </button>
            </motion.div>
          </div>
        </section>
      </PageLayout>
    );
  }

  const q = questions[currentIdx];
  return (
    <PageLayout title="Quiz Battle Arena">
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-xs text-muted-foreground">Q{currentIdx + 1}/{questions.length}</span>
              <span className="font-display text-sm text-primary font-bold">Score: {score}</span>
            </div>
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                <circle cx="50" cy="50" r="45" fill="none"
                  stroke={timeLeft <= 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                  strokeWidth="4" strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress} strokeLinecap="round"
                  className="transition-all duration-1000 linear" />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center font-display text-sm font-bold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>
                {timeLeft}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {flash && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
                className={`fixed inset-0 z-40 pointer-events-none ${flash === "correct" ? "bg-neon-green" : "bg-destructive"}`} />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={currentIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="glass-card-strong p-6">
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
                    <motion.button key={i} onClick={() => selectAnswer(i)}
                      whileHover={selected === null ? { scale: 1.02 } : {}}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      className={cls} disabled={selected !== null}>
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
    </PageLayout>
  );
};

export default QuizPage;
