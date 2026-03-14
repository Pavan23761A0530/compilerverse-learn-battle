import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, LogIn, AlertCircle } from "lucide-react";
import { isNameTaken, registerPlayer, loginPlayer, getPlayers } from "@/lib/score-manager";

const Login = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"new" | "returning">("new");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter a name"); return; }
    if (trimmed.length < 2) { setError("Name must be at least 2 characters"); return; }

    if (mode === "new") {
      if (isNameTaken(trimmed)) {
        setError("This name is already taken. Choose another or switch to 'Returning Player'.");
        return;
      }
      registerPlayer(trimmed);
    } else {
      if (!isNameTaken(trimmed)) {
        setError("Player not found. Register as a new player instead.");
        return;
      }
      loginPlayer(trimmed);
    }
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%` }}
          animate={{ y: [-15, 15, -15], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card-strong p-8 md:p-12 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Cpu className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-black neon-text mb-2">
            <span className="bg-gradient-to-r from-primary via-neon-cyan to-secondary bg-clip-text text-transparent">
              Compiler
            </span>
            <span className="text-foreground">Verse</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground">Arena – Interactive Battle Platform</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("new"); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-display text-xs transition-all ${
              mode === "new" ? "neon-btn" : "glass-card text-muted-foreground"
            }`}
          >
            New Player
          </button>
          <button
            onClick={() => { setMode("returning"); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-display text-xs transition-all ${
              mode === "returning" ? "neon-btn" : "glass-card text-muted-foreground"
            }`}
          >
            Returning Player
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">
            Enter Your Name
          </label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="Your unique name..."
            className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 font-body text-foreground text-sm focus:outline-none focus:border-primary/60 focus:shadow-[0_0_20px_hsla(265,85%,60%,0.2)] transition-all"
            autoFocus
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-destructive text-xs font-body mt-2"
            >
              <AlertCircle className="w-3 h-3" /> {error}
            </motion.p>
          )}

          <button type="submit" className="neon-btn w-full mt-6 text-sm inline-flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            {mode === "new" ? "Enter Arena" : "Welcome Back"}
          </button>
        </form>

        {getPlayers().length > 0 && mode === "returning" && (
          <div className="mt-6">
            <p className="text-xs font-display text-muted-foreground mb-2">Registered Players:</p>
            <div className="flex flex-wrap gap-1.5">
              {getPlayers().slice(0, 8).map(p => (
                <button
                  key={p.name}
                  onClick={() => setName(p.name)}
                  className="px-2 py-1 rounded text-xs font-body glass-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
