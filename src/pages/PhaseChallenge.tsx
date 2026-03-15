import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Check, X, RotateCcw, Puzzle, Zap, Lock } from "lucide-react";
import { getCurrentPlayer, updateScore, getAdminSettings } from "@/lib/score-manager";
import { getRandomChallenge, shuffleArray, type PhaseChallenge } from "@/lib/phase-challenges";
import PageLayout from "@/components/PageLayout";

const PhaseChallengePage = () => {
  const navigate = useNavigate();
  const settings = getAdminSettings();
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [challenge, setChallenge] = useState<PhaseChallenge | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => { if (!getCurrentPlayer()) navigate("/"); }, [navigate]);

  const loadChallenge = useCallback(() => {
    const result = getRandomChallenge(usedIndices);
    if (!result) {
      setUsedIndices([]);
      const fresh = getRandomChallenge([]);
      if (fresh) { setChallenge(fresh.challenge); setItems(shuffleArray(fresh.challenge.steps)); setUsedIndices([fresh.index]); }
    } else {
      setChallenge(result.challenge); setItems(shuffleArray(result.challenge.steps)); setUsedIndices(prev => [...prev, result.index]);
    }
    setChecked(false); setCorrect(false); setWrongIndices(new Set()); setRound(prev => prev + 1);
  }, [usedIndices]);

  useEffect(() => { if (settings.phaseChallengeEnabled) loadChallenge(); }, []); // eslint-disable-line

  if (!settings.phaseChallengeEnabled) {
    return (
      <PageLayout title="Phase Arrangement Challenge">
        <section className="py-20 px-4 text-center">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Not Available</h2>
          <p className="text-muted-foreground font-body text-sm">Phase Challenge has been disabled by the admin.</p>
        </section>
      </PageLayout>
    );
  }

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newItems = [...items];
    const [removed] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, removed);
    setItems(newItems); setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const checkOrder = () => {
    if (!challenge) return;
    const isCorrect = items.every((item, i) => item === challenge.steps[i]);
    setCorrect(isCorrect); setChecked(true);
    const delta = isCorrect ? 200 : -50;
    setScore(prev => prev + delta);
    updateScore("phaseChallenge", delta);
    if (!isCorrect) {
      const wrong = new Set<number>();
      items.forEach((item, i) => { if (item !== challenge.steps[i]) wrong.add(i); });
      setWrongIndices(wrong);
    }
  };

  if (!challenge) return null;

  return (
    <PageLayout title="Phase Arrangement Challenge">
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center neon-text mb-2">
              <Puzzle className="inline w-7 h-7 text-primary mr-2" />
              Complete the <span className="text-primary">Compilation Cycle</span>
            </h2>
            <div className="flex justify-center gap-6 mb-8">
              <p className="font-display text-xs text-muted-foreground">Round: {round}</p>
              <p className="font-display text-xs text-primary">Score: {score}</p>
            </div>
          </motion.div>

          <div className="glass-card-strong p-4 mb-6">
            <p className="text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">Input Code</p>
            <pre className="font-mono-code text-sm text-neon-orange">{challenge.input}</pre>
          </div>

          <p className="text-xs font-body text-muted-foreground mb-3 text-center">
            Drag cards to arrange the correct compilation transformation sequence
          </p>

          <div className="space-y-2">
            {items.map((item, i) => (
              <motion.div key={`${round}-${item}`} draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, i)}
                onDragEnd={handleDragEnd} layout
                className={`glass-card-strong p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all text-sm ${
                  checked && correct ? "border-neon-green/50" : ""
                } ${checked && !correct && wrongIndices.has(i) ? "animate-shake border-destructive/50" : ""
                } ${checked && !correct && !wrongIndices.has(i) ? "border-neon-green/50" : ""}`}>
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="font-display text-xs text-muted-foreground w-5">{i + 1}.</span>
                <span className="font-body text-xs font-medium text-foreground flex-1">{item}</span>
                {checked && (challenge.steps[i] === item ? <Check className="w-4 h-4 text-neon-green" /> : <X className="w-4 h-4 text-destructive" />)}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 justify-center">
            {!checked ? (
              <button onClick={checkOrder} className="neon-btn text-sm inline-flex items-center gap-2"><Check className="w-4 h-4" /> Check Order</button>
            ) : (
              <button onClick={loadChallenge} className="neon-btn neon-btn-cyan text-sm inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Next Challenge</button>
            )}
          </div>

          <AnimatePresence>
            {checked && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-6 glass-card p-4 text-center ${correct ? "border-neon-green/30" : "border-destructive/30"}`}>
                {correct ? (
                  <p className="font-display text-neon-green text-sm"><Zap className="inline w-4 h-4 mr-1" /> Perfect! +200 points</p>
                ) : (
                  <div>
                    <p className="font-display text-destructive text-sm mb-3">✗ Wrong order! −50 points</p>
                    <p className="font-display text-xs text-muted-foreground mb-2">Correct sequence:</p>
                    {challenge.steps.map((step, i) => (
                      <p key={i} className="font-body text-xs text-muted-foreground">{i + 1}. {step}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageLayout>
  );
};

export default PhaseChallengePage;
