import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Users, Trash2, RotateCcw, Power, PowerOff,
  LogOut, Settings, Trophy, Cpu, UserX, RefreshCw, Pencil, X,
  BarChart3, Puzzle, Swords, Search
} from "lucide-react";
import {
  isAdmin, logoutPlayer, getPlayers, adminDeletePlayer, adminResetPlayerScore,
  adminResetAllScores, adminDeleteAllPlayers, adminClearCompletedExams,
  getAdminSettings, saveAdminSettings, AVATARS, adminUpdatePlayer,
  type PlayerScores, type AdminSettings
} from "@/lib/score-manager";

type Tab = "users" | "controls" | "analytics";

function getSectionScore(p: PlayerScores, key: string): number {
  if (key === "simulator") return p.simulator;
  if (key === "phaseChallenge") return p.phaseChallenge;
  if (key === "quiz") return p.quiz.reduce((a, b) => a + b, 0);
  if (key === "errorDetective") return p.errorDetective;
  return p.total;
}

const ANALYTICS_SECTIONS = [
  { key: "simulator", label: "Simulator", icon: <Cpu className="w-4 h-4" /> },
  { key: "phaseChallenge", label: "Phase Challenge", icon: <Puzzle className="w-4 h-4" /> },
  { key: "quiz", label: "Quiz", icon: <Swords className="w-4 h-4" /> },
  { key: "errorDetective", label: "Error Detective", icon: <Search className="w-4 h-4" /> },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerScores[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [tab, setTab] = useState<Tab>("users");

  useEffect(() => { if (!isAdmin()) navigate("/"); }, [navigate]);

  const refresh = () => { setPlayers(getPlayers()); setSettings(getAdminSettings()); };
  useEffect(refresh, []);

  const handleLogout = () => { logoutPlayer(); navigate("/"); };

  const toggleQuiz = (idx: number) => {
    const s = { ...settings, quizActive: [...settings.quizActive] };
    s.quizActive[idx] = !s.quizActive[idx];
    saveAdminSettings(s); setSettings(s);
  };

  const toggleFeature = (key: "phaseChallengeEnabled" | "errorDetectiveEnabled") => {
    const s = { ...settings, [key]: !settings[key] };
    saveAdminSettings(s); setSettings(s);
  };

  const startEdit = (p: PlayerScores) => {
    setEditingPlayer(p.name); setEditName(p.name); setEditAvatar(p.avatar);
  };

  const saveEdit = (originalName: string) => {
    adminUpdatePlayer(originalName, { name: editName, avatar: editAvatar });
    setEditingPlayer(null); refresh();
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="glass-card p-2 text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "users" as Tab, icon: <Users className="w-3 h-3" />, label: "Users & Scores" },
            { key: "controls" as Tab, icon: <Settings className="w-3 h-3" />, label: "Game Controls" },
            { key: "analytics" as Tab, icon: <BarChart3 className="w-3 h-3" />, label: "Analytics" },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display transition-all ${
                tab === t.key ? "neon-btn" : "glass-card text-muted-foreground"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => { if(confirm("Reset ALL scores?")) { adminResetAllScores(); refresh(); }}}
                className="glass-card px-3 py-2 text-xs font-display text-muted-foreground hover:text-neon-orange transition-colors flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3" /> Reset All Scores
              </button>
              <button onClick={() => { if(confirm("Delete ALL users? This cannot be undone!")) { adminDeleteAllPlayers(); refresh(); }}}
                className="glass-card px-3 py-2 text-xs font-display text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5">
                <UserX className="w-3 h-3" /> Delete All Users
              </button>
              <button onClick={() => { adminClearCompletedExams(); refresh(); }}
                className="glass-card px-3 py-2 text-xs font-display text-muted-foreground hover:text-neon-cyan transition-colors flex items-center gap-1.5">
                <Trophy className="w-3 h-3" /> Clear Exam Completions
              </button>
              <button onClick={refresh}
                className="glass-card px-3 py-2 text-xs font-display text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            {players.length === 0 ? (
              <p className="text-center text-muted-foreground font-body text-sm">No registered users.</p>
            ) : (
              <div className="space-y-2">
                {players.map(p => (
                  <div key={p.name} className="glass-card-strong p-4 flex items-center gap-4">
                    {editingPlayer === p.name ? (
                      <div className="flex-1 flex flex-wrap items-center gap-3">
                        <div className="flex gap-1">
                          {AVATARS.map(av => (
                            <button key={av} onClick={() => setEditAvatar(av)}
                              className={`w-8 h-8 rounded text-lg flex items-center justify-center ${editAvatar === av ? "glass-card-strong border-primary/50" : "glass-card"}`}>
                              {av}
                            </button>
                          ))}
                        </div>
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                          className="bg-background/50 border border-border rounded px-3 py-1.5 font-body text-sm text-foreground w-40" />
                        <button onClick={() => saveEdit(p.name)} className="neon-btn text-xs px-3 py-1">Save</button>
                        <button onClick={() => setEditingPlayer(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <span className="text-2xl">{p.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold text-sm text-foreground truncate">{p.name}</p>
                          <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                            <span>SIM:{p.simulator}</span>
                            <span>PH:{p.phaseChallenge}</span>
                            <span>QZ:{p.quiz.reduce((a,b)=>a+b,0)}</span>
                            <span>ED:{p.errorDetective}</span>
                            <span className="text-primary font-bold">T:{p.total}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => startEdit(p)} title="Edit"
                            className="glass-card p-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => { adminResetPlayerScore(p.name); refresh(); }} title="Reset score"
                            className="glass-card p-1.5 text-muted-foreground hover:text-neon-orange transition-colors">
                            <RotateCcw className="w-3 h-3" />
                          </button>
                          <button onClick={() => { if(confirm(`Delete ${p.name}?`)) { adminDeletePlayer(p.name); refresh(); }}} title="Delete"
                            className="glass-card p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === "controls" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card-strong p-6">
              <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" /> Quiz Assessments
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {settings.quizActive.map((active, i) => (
                  <button key={i} onClick={() => toggleQuiz(i)}
                    className={`glass-card p-4 flex items-center gap-3 transition-all ${active ? "border-neon-green/50" : "border-destructive/30"}`}>
                    {active ? <Power className="w-4 h-4 text-neon-green" /> : <PowerOff className="w-4 h-4 text-destructive" />}
                    <div className="text-left">
                      <p className="font-display text-xs font-bold text-foreground">Assessment {i + 1}</p>
                      <p className={`text-[10px] font-body ${active ? "text-neon-green" : "text-destructive"}`}>
                        {active ? "ACTIVE" : "INACTIVE"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card-strong p-6">
              <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" /> Game Modes
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={() => toggleFeature("phaseChallengeEnabled")}
                  className={`glass-card p-4 flex items-center gap-3 transition-all ${settings.phaseChallengeEnabled ? "border-neon-green/50" : "border-destructive/30"}`}>
                  {settings.phaseChallengeEnabled ? <Power className="w-4 h-4 text-neon-green" /> : <PowerOff className="w-4 h-4 text-destructive" />}
                  <div className="text-left">
                    <p className="font-display text-xs font-bold text-foreground">Phase Challenge</p>
                    <p className={`text-[10px] font-body ${settings.phaseChallengeEnabled ? "text-neon-green" : "text-destructive"}`}>
                      {settings.phaseChallengeEnabled ? "ENABLED" : "DISABLED"}
                    </p>
                  </div>
                </button>
                <button onClick={() => toggleFeature("errorDetectiveEnabled")}
                  className={`glass-card p-4 flex items-center gap-3 transition-all ${settings.errorDetectiveEnabled ? "border-neon-green/50" : "border-destructive/30"}`}>
                  {settings.errorDetectiveEnabled ? <Power className="w-4 h-4 text-neon-green" /> : <PowerOff className="w-4 h-4 text-destructive" />}
                  <div className="text-left">
                    <p className="font-display text-xs font-bold text-foreground">Error Detective</p>
                    <p className={`text-[10px] font-body ${settings.errorDetectiveEnabled ? "text-neon-green" : "text-destructive"}`}>
                      {settings.errorDetectiveEnabled ? "ENABLED" : "DISABLED"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {ANALYTICS_SECTIONS.map(sec => {
              const scores = players.map(p => getSectionScore(p, sec.key));
              const nonZero = scores.filter(s => s > 0);
              const highest = scores.length > 0 ? Math.max(...scores) : 0;
              const avg = nonZero.length > 0 ? Math.round(nonZero.reduce((a, b) => a + b, 0) / nonZero.length) : 0;
              const attempts = nonZero.length;
              const top5 = [...players]
                .sort((a, b) => getSectionScore(b, sec.key) - getSectionScore(a, sec.key))
                .slice(0, 5)
                .filter(p => getSectionScore(p, sec.key) > 0);

              return (
                <div key={sec.key} className="glass-card-strong p-6">
                  <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    {sec.icon} {sec.label}
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="glass-card p-3 text-center">
                      <p className="text-[10px] font-display text-muted-foreground">Highest</p>
                      <p className="font-display text-lg font-bold text-primary">{highest}</p>
                    </div>
                    <div className="glass-card p-3 text-center">
                      <p className="text-[10px] font-display text-muted-foreground">Average</p>
                      <p className="font-display text-lg font-bold text-neon-cyan">{avg}</p>
                    </div>
                    <div className="glass-card p-3 text-center">
                      <p className="text-[10px] font-display text-muted-foreground">Attempts</p>
                      <p className="font-display text-lg font-bold text-neon-orange">{attempts}</p>
                    </div>
                  </div>
                  {top5.length > 0 && (
                    <div>
                      <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest mb-2">Top 5</p>
                      <div className="space-y-1">
                        {top5.map((p, i) => (
                          <div key={p.name} className="flex items-center gap-2 text-xs font-body text-foreground">
                            <span className="w-5 text-center font-display text-muted-foreground">{i + 1}</span>
                            <span>{p.avatar}</span>
                            <span className="flex-1 truncate">{p.name}</span>
                            <span className="font-display text-primary font-bold">{getSectionScore(p, sec.key)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
