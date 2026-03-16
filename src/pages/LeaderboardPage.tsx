import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Cpu, Puzzle, Swords, Search, BarChart3 } from "lucide-react";
import { getCurrentPlayer, getPlayers, getPlayerScores, resetPlayerScores, type PlayerScores } from "@/lib/score-manager";
import PageLayout from "@/components/PageLayout";

const BADGES = ["🥇", "🥈", "🥉"];

type Section = "overall" | "simulator" | "phaseChallenge" | "quiz" | "errorDetective";

const SECTIONS: { key: Section; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "overall", label: "Overall", icon: <BarChart3 className="w-5 h-5" />, color: "from-primary to-secondary" },
  { key: "simulator", label: "Simulator", icon: <Cpu className="w-5 h-5" />, color: "from-primary to-secondary" },
  { key: "phaseChallenge", label: "Phase Challenge", icon: <Puzzle className="w-5 h-5" />, color: "from-neon-cyan to-neon-blue" },
  { key: "quiz", label: "Quiz", icon: <Swords className="w-5 h-5" />, color: "from-neon-pink to-primary" },
  { key: "errorDetective", label: "Error Detective", icon: <Search className="w-5 h-5" />, color: "from-neon-orange to-neon-pink" },
];

function getSectionScore(p: PlayerScores, section: Section): number {
  if (section === "overall") return p.total;
  if (section === "quiz") return p.quiz.reduce((a, b) => a + b, 0);
  return p[section];
}

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overall");
  const [myScores, setMyScores] = useState<PlayerScores | null>(null);
  const playerName = getCurrentPlayer();

  useEffect(() => { if (!playerName) navigate("/"); }, [playerName, navigate]);
  useEffect(() => { setMyScores(getPlayerScores()); }, []);

  const board = getPlayers()
    .sort((a, b) => getSectionScore(b, section) - getSectionScore(a, section))
    .slice(0, 10);

  const handleReset = () => {
    if (confirm("Reset all your scores to 0?")) {
      resetPlayerScores();
      setMyScores(getPlayerScores());
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
            <p className="text-center text-muted-foreground font-body text-sm mb-6">Select a section to view rankings</p>
          </motion.div>

          {/* Section selector cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
            {SECTIONS.map((s) => (
              <motion.button key={s.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSection(s.key)}
                className={`glass-card p-3 flex flex-col items-center gap-2 transition-all ${
                  section === s.key ? "border-primary/50 bg-primary/10" : "hover:border-primary/30"
                }`}>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
                  {s.icon}
                </div>
                <span className="font-display text-[10px] text-foreground">{s.label}</span>
              </motion.button>
            ))}
          </div>

          {/* My scores */}
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
                <ScoreCard label="Simulator" value={myScores.simulator} highlight={section === "simulator"} />
                <ScoreCard label="Phase Challenge" value={myScores.phaseChallenge} highlight={section === "phaseChallenge"} />
                <ScoreCard label="Quiz Total" value={myScores.quiz.reduce((a, b) => a + b, 0)} highlight={section === "quiz"} />
                <ScoreCard label="Error Detective" value={myScores.errorDetective} highlight={section === "errorDetective"} />
                <ScoreCard label="Total" value={myScores.total} highlight={section === "overall"} />
              </div>
            </motion.div>
          )}

          {/* Rankings */}
          <h3 className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">
            {SECTIONS.find(s => s.key === section)?.label} Rankings
          </h3>

          {board.length === 0 ? (
            <p className="text-center text-muted-foreground font-body text-sm">No scores yet. Play some games!</p>
          ) : (
            <div className="space-y-2">
              {board.map((entry, i) => {
                const sectionScore = getSectionScore(entry, section);
                return (
                  <motion.div key={entry.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card-strong p-4 flex items-center gap-4 ${i < 3 ? "border-primary/30" : ""} ${entry.name === playerName ? "ring-1 ring-primary/30" : ""}`}>
                    <span className="font-display text-xl w-10 text-center">
                      {i < 3 ? BADGES[i] : <span className="text-muted-foreground text-sm">#{i + 1}</span>}
                    </span>
                    <span className="text-xl">{entry.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-bold text-sm text-foreground truncate">{entry.name}</p>
                      {section === "overall" && (
                        <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                          <span>SIM:{entry.simulator}</span>
                          <span>PH:{entry.phaseChallenge}</span>
                          <span>QZ:{entry.quiz.reduce((a, b) => a + b, 0)}</span>
                          <span>ED:{entry.errorDetective}</span>
                        </div>
                      )}
                    </div>
                    <span className="font-display text-lg font-bold text-primary">{sectionScore}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

const ScoreCard = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`glass-card p-3 text-center ${highlight ? "border-primary/30 bg-primary/5" : ""}`}>
    <p className="font-body text-xs text-muted-foreground">{label}</p>
    <p className={`font-display text-lg font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
  </div>
);

export default LeaderboardPage;
