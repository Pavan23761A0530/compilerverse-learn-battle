import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";
import { getCurrentPlayer, getLeaderboard, getPlayerScores, resetPlayerScores, type PlayerScores } from "@/lib/score-manager";
import PageLayout from "@/components/PageLayout";

const BADGES = ["🥇", "🥈", "🥉"];

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<PlayerScores[]>([]);
  const [myScores, setMyScores] = useState<PlayerScores | null>(null);
  const playerName = getCurrentPlayer();

  useEffect(() => { if (!playerName) navigate("/"); }, [playerName, navigate]);
  useEffect(() => { setBoard(getLeaderboard()); setMyScores(getPlayerScores()); }, []);

  const handleReset = () => {
    if (confirm("Reset all your scores to 0?")) {
      resetPlayerScores(); setBoard(getLeaderboard()); setMyScores(getPlayerScores());
    }
  };

  return (
    <PageLayout title="Leaderboard">
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center neon-text mb-2">
              <Trophy className="inline w-7 h-7 text-neon-orange mr-2" /> Leader<span className="text-primary">board</span>
            </h2>
            <p className="text-center text-muted-foreground font-body text-sm mb-8">Top 10 across all sections</p>
          </motion.div>

          {myScores && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <span className="text-xl">{myScores.avatar}</span> {myScores.name}
                </h3>
                <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <ScoreCard label="Simulator" value={myScores.simulator} />
                <ScoreCard label="Phase Challenge" value={myScores.phaseChallenge} />
                <ScoreCard label="Quiz Total" value={myScores.quiz.reduce((a, b) => a + b, 0)} />
                <ScoreCard label="Error Detective" value={myScores.errorDetective} />
                <ScoreCard label="Total" value={myScores.total} highlight />
              </div>
            </motion.div>
          )}

          {board.length === 0 ? (
            <p className="text-center text-muted-foreground font-body text-sm">No scores yet. Play some games!</p>
          ) : (
            <div className="space-y-2">
              {board.map((entry, i) => (
                <motion.div key={entry.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card-strong p-4 flex items-center gap-4 ${i < 3 ? "border-primary/30" : ""} ${entry.name === playerName ? "ring-1 ring-primary/30" : ""}`}>
                  <span className="font-display text-xl w-10 text-center">
                    {i < 3 ? BADGES[i] : <span className="text-muted-foreground text-sm">#{i + 1}</span>}
                  </span>
                  <span className="text-xl">{entry.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-bold text-sm text-foreground truncate">{entry.name}</p>
                    <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                      <span>SIM:{entry.simulator}</span>
                      <span>PH:{entry.phaseChallenge}</span>
                      <span>QZ:{entry.quiz.reduce((a, b) => a + b, 0)}</span>
                      <span>ED:{entry.errorDetective}</span>
                    </div>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">{entry.total}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

const ScoreCard = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`glass-card p-3 text-center ${highlight ? "border-primary/30" : ""}`}>
    <p className="font-body text-xs text-muted-foreground">{label}</p>
    <p className={`font-display text-lg font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
  </div>
);

export default LeaderboardPage;
