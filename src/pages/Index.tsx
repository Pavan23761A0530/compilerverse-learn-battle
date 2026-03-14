import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CompilerSimulator from "@/components/CompilerSimulator";
import DragDropGame from "@/components/DragDropGame";
import QuizBattle from "@/components/QuizBattle";
import ErrorDetective from "@/components/ErrorDetective";
import Leaderboard from "@/components/Leaderboard";

const Index = () => {
  const [pendingScore, setPendingScore] = useState<{ score: number; total: number } | null>(null);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    setPendingScore({ score, total });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CompilerSimulator />
      <DragDropGame />
      <QuizBattle onComplete={handleQuizComplete} />
      <ErrorDetective />
      <Leaderboard pendingScore={pendingScore} />
      <footer className="py-8 text-center border-t border-border">
        <p className="font-display text-xs text-muted-foreground tracking-widest">
          CompilerVerse © 2026 — Learn Compiler Design Interactively
        </p>
      </footer>
    </div>
  );
};

export default Index;
