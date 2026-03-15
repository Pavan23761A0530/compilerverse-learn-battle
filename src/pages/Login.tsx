import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, LogIn, AlertCircle, Shield } from "lucide-react";
import { isNameTaken, loginPlayer, getPlayers, isAdminCredentials, loginAsAdmin } from "@/lib/score-manager";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handlePlayerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter a name"); return; }
    if (!isNameTaken(trimmed)) { setError("Player not found. Register first."); return; }
    loginPlayer(trimmed);
    navigate("/home");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !password) { setError("Enter credentials"); return; }
    if (isAdminCredentials(trimmed, password)) {
      loginAsAdmin();
      loginPlayer(trimmed);
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%` }}
          animate={{ y: [-15, 15, -15], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }} className="glass-card-strong p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4">
            <Cpu className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-black neon-text mb-2">
            <span className="bg-gradient-to-r from-primary via-neon-cyan to-secondary bg-clip-text text-transparent">Compiler</span>
            <span className="text-foreground">Verse</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground">Arena – Interactive Battle Platform</p>
        </div>

        {/* Toggle: Player / Admin */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => { setShowAdminLogin(false); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-display text-xs transition-all ${!showAdminLogin ? "neon-btn" : "glass-card text-muted-foreground"}`}>
            Player Login
          </button>
          <button onClick={() => { setShowAdminLogin(true); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-display text-xs transition-all ${showAdminLogin ? "neon-btn" : "glass-card text-muted-foreground"}`}>
            <Shield className="w-3 h-3 inline mr-1" /> Admin
          </button>
        </div>

        {!showAdminLogin ? (
          <form onSubmit={handlePlayerLogin}>
            <label className="block text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">Your Name</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Enter registered name..." autoFocus
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 font-body text-foreground text-sm focus:outline-none focus:border-primary/60 focus:shadow-[0_0_20px_hsla(265,85%,60%,0.2)] transition-all" />
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-destructive text-xs font-body mt-2">
              <AlertCircle className="w-3 h-3" /> {error}
            </motion.p>}
            <button type="submit" className="neon-btn w-full mt-6 text-sm inline-flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Welcome Back
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4 font-body">
              New player? <Link to="/register" className="text-primary hover:underline">Register here</Link>
            </p>

            {getPlayers().length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-display text-muted-foreground mb-2">Registered Players:</p>
                <div className="flex flex-wrap gap-1.5">
                  {getPlayers().slice(0, 8).map(p => (
                    <button key={p.name} type="button" onClick={() => setName(p.name)}
                      className="px-2 py-1 rounded text-xs font-body glass-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                      {p.avatar} {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleAdminLogin}>
            <label className="block text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">Admin Username</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Admin username..."
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 font-body text-foreground text-sm focus:outline-none focus:border-primary/60 transition-all mb-3" />
            <label className="block text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Password..."
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 font-body text-foreground text-sm focus:outline-none focus:border-primary/60 transition-all" />
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-destructive text-xs font-body mt-2">
              <AlertCircle className="w-3 h-3" /> {error}
            </motion.p>}
            <button type="submit" className="neon-btn w-full mt-6 text-sm inline-flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Admin Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
