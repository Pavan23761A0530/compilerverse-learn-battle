import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Users, Trash2, RotateCcw, Power, PowerOff,
  LogOut, Settings, Trophy, Cpu, UserX, RefreshCw, Pencil, X
} from "lucide-react";
import {
  isAdmin, logoutPlayer, getPlayers, adminDeletePlayer, adminResetPlayerScore,
  adminResetAllScores, adminDeleteAllPlayers, adminClearCompletedExams,
  getAdminSettings, saveAdminSettings, AVATARS, adminUpdatePlayer,
  type PlayerScores, type AdminSettings
} from "@/lib/score-manager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerScores[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [tab, setTab] = useState<"users" | "controls">("users");

  useEffect(() => {
    if (!isAdmin()) navigate("/");
  }, [navigate]);

  const refresh = () => {
    setPlayers(getPlayers());
    setSettings(getAdminSettings());
  };

  useEffect(refresh, []);

  const handleLogout = () => { logoutPlayer(); navigate("/"); };

  const toggleQuiz = (idx: number) => {
    const s = { ...settings, quizActive: [...settings.quizActive] };
    s.quizActive[idx] = !s.quizActive[idx];
    saveAdminSettings(s);
    setSettings(s);
  };

  const toggleFeature = (key: "phaseChallengeEnabled" | "errorDetectiveEnabled") => {
    const s = { ...settings, [key]: !settings[key] };
    saveAdminSettings(s);
    setSettings(s);
  };

  const startEdit = (p: PlayerScores) => {
    setEditingPlayer(p.name);
    setEditName(p.name);
    setEditAvatar(p.avatar);
  };

  const saveEdit = (originalName: string) => {
    adminUpdatePlayer(originalName, { name: editName, avatar: editAvatar });
    setEditingPlayer(null);
    refresh();
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
          <button onClick={() => setTab("users")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display transition-all ${
              tab === "users" ? "neon-btn" : "glass-card text-muted-foreground"
            }`}>
            <Users className="w-3 h-3" /> Users & Scores
          </button>
          <button onClick={() => setTab("controls")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display transition-all ${
              tab === "controls" ? "neon-btn" : "glass-card text-muted-foreground"
            }`}>
            <Settings className="w-3 h-3" /> Game Controls
          </button>
        </div>

        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Bulk actions */}
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

            {/* Player list */}
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
            {/* Quiz controls */}
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

            {/* Feature toggles */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
