import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, UserPlus, AlertCircle } from "lucide-react";
import { isNameTaken, registerPlayer, AVATARS } from "@/lib/score-manager";

const Register = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter a name"); return; }
    if (trimmed.length < 2) { setError("Name must be at least 2 characters"); return; }
    if (isNameTaken(trimmed)) { setError("This name is already taken."); return; }
    registerPlayer(trimmed, avatar);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-secondary/20"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-10, 10, -10], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card-strong p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <Cpu className="w-8 h-8 text-primary mx-auto mb-3" />
          <h1 className="font-display text-2xl font-black neon-text mb-1">Register</h1>
          <p className="font-body text-sm text-muted-foreground">Create your player profile</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">Choose Avatar</label>
          <div className="flex flex-wrap gap-2 mb-5">
            {AVATARS.map(av => (
              <button key={av} type="button" onClick={() => setAvatar(av)}
                className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${
                  avatar === av ? "glass-card-strong border-primary/60 scale-110 shadow-[0_0_15px_hsla(265,85%,60%,0.4)]" : "glass-card hover:border-primary/30"
                }`}>
                {av}
              </button>
            ))}
          </div>

          <label className="block text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">Player Name</label>
          <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="Choose a unique name..." autoFocus
            className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 font-body text-foreground text-sm focus:outline-none focus:border-primary/60 focus:shadow-[0_0_20px_hsla(265,85%,60%,0.2)] transition-all" />

          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-destructive text-xs font-body mt-2">
            <AlertCircle className="w-3 h-3" /> {error}
          </motion.p>}

          <button type="submit" className="neon-btn w-full mt-6 text-sm inline-flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> Enter Arena
          </button>

          <p className="text-center text-xs text-muted-foreground mt-4 font-body">
            Already registered? <Link to="/" className="text-primary hover:underline">Login here</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
