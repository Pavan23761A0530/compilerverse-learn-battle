import { motion } from "framer-motion";
import { Play, Zap } from "lucide-react";

const phases = [
  "Source Code",
  "Lexical",
  "Syntax",
  "Semantic",
  "IR",
  "Optimization",
  "Target Code",
];

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-display text-primary mb-6"
        >
          <Zap className="w-3 h-3" /> Interactive Learning Platform
        </motion.div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight neon-text mb-4">
          <span className="bg-gradient-to-r from-primary via-neon-cyan to-secondary bg-clip-text text-transparent">
            Compiler
          </span>
          <span className="text-foreground">Verse</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
          Learn Compiler Design Through Interactive Games, Simulations & Battle Quizzes
        </p>

        <a href="#simulator" className="neon-btn inline-flex items-center gap-2 text-sm">
          <Play className="w-4 h-4" /> Start Exploring
        </a>
      </motion.div>

      {/* Animated Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-16 w-full max-w-4xl z-10"
      >
        <p className="text-center text-xs font-display text-muted-foreground mb-4 tracking-widest uppercase">
          Compilation Pipeline
        </p>
        <div className="flex flex-wrap justify-center items-center gap-1 md:gap-0">
          {phases.map((phase, i) => (
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
              className="flex items-center"
            >
              <div className="glass-card px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-mono-code font-semibold text-foreground hover:border-primary/50 transition-all cursor-default animate-glow-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {phase}
              </div>
              {i < phases.length - 1 && (
                <div className="hidden md:block w-6 h-0.5 pipeline-flow" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
