import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Play, Puzzle, Swords, Search, Trophy, LogOut, Zap } from "lucide-react";
import { getCurrentPlayer, logoutPlayer } from "@/lib/score-manager";

const phases = ["Source Code", "Lexical", "Syntax", "Semantic", "IR", "Optimization", "Target Code"];

const menuItems = [
  { title: "Compiler Simulator", desc: "Run code through all compilation phases", icon: <Cpu className="w-6 h-6" />, path: "/simulator", color: "from-primary to-secondary" },
  { title: "Phase Challenge", desc: "Arrange compilation transformations correctly", icon: <Puzzle className="w-6 h-6" />, path: "/phase-challenge", color: "from-neon-cyan to-neon-blue" },
  { title: "Quiz Battle Arena", desc: "5 assessments × 30 questions each", icon: <Swords className="w-6 h-6" />, path: "/quiz", color: "from-neon-pink to-primary" },
  { title: "Error Detective", desc: "Identify error types in code snippets", icon: <Search className="w-6 h-6" />, path: "/error-detective", color: "from-neon-orange to-neon-pink" },
  { title: "Leaderboard", desc: "See top players across all sections", icon: <Trophy className="w-6 h-6" />, path: "/leaderboard", color: "from-neon-green to-neon-cyan" },
];

const Home = () => {
  const navigate = useNavigate();
  const playerName = getCurrentPlayer();

  useEffect(() => {
    if (!playerName) navigate("/");
  }, [playerName, navigate]);

  const handleLogout = () => {
    logoutPlayer();
    navigate("/");
  };

  if (!playerName) return null;

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Header */}
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-12">
          <Link to="/home" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
            <Cpu className="h-6 w-6" /> CompilerVerse
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-muted-foreground">
              Welcome, <span className="text-primary font-semibold">{playerName}</span>
            </span>
            <button onClick={handleLogout} className="glass-card p-2 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-display text-primary mb-4">
            <Zap className="w-3 h-3" /> Interactive Learning Platform
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black neon-text mb-3">
            <span className="bg-gradient-to-r from-primary via-neon-cyan to-secondary bg-clip-text text-transparent">Compiler</span>
            <span className="text-foreground">Verse</span>
            <span className="text-primary text-2xl md:text-3xl ml-2">Arena</span>
          </h1>
          <p className="font-body text-muted-foreground">Learn Compiler Design Through Interactive Games & Battle Quizzes</p>
        </motion.div>

        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <p className="text-center text-xs font-display text-muted-foreground mb-4 tracking-widest uppercase">Compilation Pipeline</p>
          <div className="flex flex-wrap justify-center items-center gap-1 md:gap-0">
            {phases.map((phase, i) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center"
              >
                <div className="glass-card px-3 py-2 text-xs font-mono-code font-semibold text-foreground animate-glow-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                  {phase}
                </div>
                {i < phases.length - 1 && <div className="hidden md:block w-6 h-0.5 pipeline-flow" />}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link
                to={item.path}
                className="glass-card-strong p-6 block group hover:border-primary/40 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary font-display text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3" /> Enter
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
