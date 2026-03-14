import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, User, Save } from "lucide-react";

interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  date: string;
}

const STORAGE_KEY = "compilerverse_leaderboard";

function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveToLeaderboard(entry: LeaderboardEntry) {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board.slice(0, 10)));
}

const BADGES = ["🥇", "🥈", "🥉"];

const Leaderboard = ({ pendingScore }: { pendingScore: { score: number; total: number } | null }) => {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setBoard(getLeaderboard()); }, []);

  const handleSave = () => {
    if (!name.trim() || !pendingScore) return;
    saveToLeaderboard({
      name: name.trim(),
      score: pendingScore.score,
      total: pendingScore.total,
      date: new Date().toLocaleDateString(),
    });
    setBoard(getLeaderboard());
    setSaved(true);
  };

  return (
    <section id="leaderboard" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center neon-text mb-2">
            <Trophy className="inline w-8 h-8 text-neon-orange mr-2" />
            Leader<span className="text-primary">board</span>
          </h2>
          <p className="text-center text-muted-foreground font-body mb-10">Top 10 Compiler Masters</p>
        </motion.div>

        {/* Save score form */}
        {pendingScore && !saved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong p-6 mb-8"
          >
            <p className="font-display text-sm text-primary mb-3">
              Save your score: {pendingScore.score}/{pendingScore.total}
            </p>
            <div className="flex gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
              <button onClick={handleSave} className="neon-btn-green neon-btn text-sm inline-flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </motion.div>
        )}

        {saved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-neon-green font-display text-sm mb-8"
          >
            ✓ Score saved!
          </motion.p>
        )}

        {/* Board */}
        {board.length === 0 ? (
          <p className="text-center text-muted-foreground font-body text-sm">No scores yet. Complete a quiz to get on the board!</p>
        ) : (
          <div className="space-y-3">
            {board.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card-strong p-4 flex items-center gap-4 ${i < 3 ? "border-primary/30" : ""}`}
              >
                <span className="font-display text-xl w-10 text-center">
                  {i < 3 ? BADGES[i] : <span className="text-muted-foreground text-sm">#{i + 1}</span>}
                </span>
                <User className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-body font-bold text-sm text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <span className="font-display text-lg font-bold text-primary">{entry.score}/{entry.total}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
