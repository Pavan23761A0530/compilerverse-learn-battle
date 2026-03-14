import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, Home, ArrowLeft } from "lucide-react";

const PageLayout = ({ title, children }: { title: string; children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 glass-card-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/home" className="flex items-center gap-2 font-display text-sm font-bold text-primary">
            <Cpu className="h-5 w-5" /> CompilerVerse
          </Link>
          <span className="font-display text-xs text-muted-foreground hidden sm:block">{title}</span>
          <Link to="/home" className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default PageLayout;
