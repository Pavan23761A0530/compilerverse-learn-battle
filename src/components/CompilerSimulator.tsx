import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code, TreePine, Shield, Cpu, Zap, ChevronRight } from "lucide-react";
import { tokenize, buildParseTree, semanticAnalysis, generateIR, optimize, type Token, type TreeNode, type SemanticResult } from "@/lib/compiler";

const TOKEN_CLASSES: Record<string, string> = {
  Keyword: "token-keyword",
  Identifier: "token-identifier",
  Operator: "token-operator",
  Number: "token-number",
  Symbol: "token-symbol",
  String: "token-keyword",
  Unknown: "token-symbol",
};

const ParseTreeViz = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: depth * 0.2, duration: 0.4 }}
    className="flex flex-col items-center"
  >
    <div className="glass-card px-3 py-1.5 text-sm font-mono-code font-bold text-neon-cyan border border-neon-cyan/30">
      {node.label}
    </div>
    {node.children.length > 0 && (
      <div className="flex gap-6 mt-3 relative">
        {node.children.map((child, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-px h-4 bg-primary/40" />
            <ParseTreeViz node={child} depth={depth + 1} />
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

const CompilerSimulator = () => {
  const [code, setCode] = useState("int a = 5 + 3;");
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [semantic, setSemantic] = useState<SemanticResult | null>(null);
  const [ir, setIR] = useState<string[]>([]);
  const [optimized, setOptimized] = useState<{ lines: string[]; applied: string[] } | null>(null);

  const runCompiler = () => {
    const toks = tokenize(code);
    setTokens(toks);
    setTree(buildParseTree(toks));
    setSemantic(semanticAnalysis(code, toks));
    const irLines = generateIR(toks);
    setIR(irLines);
    setOptimized(optimize(irLines));
    setActivePhase(0);
  };

  const phases = [
    { title: "Lexical Analysis", icon: <Code className="w-4 h-4" /> },
    { title: "Syntax Analysis", icon: <TreePine className="w-4 h-4" /> },
    { title: "Semantic Analysis", icon: <Shield className="w-4 h-4" /> },
    { title: "IR Generation", icon: <Cpu className="w-4 h-4" /> },
    { title: "Optimization", icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <section id="simulator" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center neon-text mb-2">
            Compiler Phase <span className="text-primary">Simulator</span>
          </h2>
          <p className="text-center text-muted-foreground font-body mb-10">Enter C code and watch each compilation phase in action</p>
        </motion.div>

        {/* Code Input */}
        <div className="glass-card-strong p-6 mb-6">
          <label className="text-xs font-display text-muted-foreground uppercase tracking-widest mb-2 block">Source Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-lg p-4 font-mono-code text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
            rows={3}
            placeholder="int a = 5 + 3;"
          />
          <button onClick={runCompiler} className="neon-btn mt-4 text-sm inline-flex items-center gap-2">
            <Play className="w-4 h-4" /> Run Compiler
          </button>
        </div>

        {/* Phase tabs */}
        {activePhase !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-2 mb-6">
              {phases.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display transition-all ${
                    activePhase === i
                      ? "neon-btn text-primary-foreground"
                      : "glass-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.icon} {p.title}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card-strong p-6"
              >
                {/* Lexical */}
                {activePhase === 0 && (
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" /> Token Stream
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tokens.map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.08 }}
                          className={`${TOKEN_CLASSES[t.type]} px-3 py-1.5 rounded-lg text-xs font-mono-code font-semibold flex items-center gap-1.5`}
                        >
                          <span className="opacity-60 text-[10px]">{t.type}</span>
                          <ChevronRight className="w-2.5 h-2.5 opacity-40" />
                          {t.value}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Syntax */}
                {activePhase === 1 && tree && (
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                      <TreePine className="w-5 h-5 text-primary" /> Parse Tree
                    </h3>
                    <div className="flex justify-center py-4">
                      <ParseTreeViz node={tree} />
                    </div>
                  </div>
                )}

                {/* Semantic */}
                {activePhase === 2 && semantic && (
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> Semantic Check
                    </h3>
                    <div className="space-y-2">
                      {semantic.messages.map((m, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium ${
                            m.type === "success"
                              ? "bg-neon-green/10 border border-neon-green/30 text-neon-green"
                              : "bg-destructive/10 border border-destructive/30 text-destructive"
                          }`}
                        >
                          {m.type === "success" ? "✓" : "✗"} {m.text}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* IR */}
                {activePhase === 3 && (
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" /> Three Address Code
                    </h3>
                    <div className="bg-background/50 rounded-lg p-4 font-mono-code text-sm space-y-1">
                      {ir.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="text-neon-cyan"
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimization */}
                {activePhase === 4 && optimized && (
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" /> Optimized Code
                    </h3>
                    <div className="bg-background/50 rounded-lg p-4 font-mono-code text-sm space-y-1 mb-4">
                      {optimized.lines.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="text-neon-green"
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                    {optimized.applied.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {optimized.applied.map((a, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-display bg-neon-green/10 border border-neon-green/30 text-neon-green">
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CompilerSimulator;
