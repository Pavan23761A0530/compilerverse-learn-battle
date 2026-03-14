export interface Question {
  question: string;
  options: string[];
  answer: number; // 0-indexed
  topic: string;
}

export const QUESTIONS: Question[] = [
  { question: "Which phase converts source code into tokens?", options: ["Syntax", "Semantic", "Lexical", "Optimization"], answer: 2, topic: "Lexical Analysis" },
  { question: "Which data structure is used in syntax analysis?", options: ["Stack", "Queue", "Linked List", "Tree"], answer: 3, topic: "Syntax Analysis" },
  { question: "FIRST and FOLLOW sets are used in?", options: ["Lexical Analysis", "LL(1) Parsing", "Optimization", "Code Generation"], answer: 1, topic: "FIRST and FOLLOW" },
  { question: "Three address code is generated in?", options: ["Semantic Analysis", "IR Generation", "Optimization", "Loader"], answer: 1, topic: "Intermediate Code" },
  { question: "Constant folding is an example of?", options: ["Lexical Optimization", "Code Optimization", "Semantic Analysis", "Parsing"], answer: 1, topic: "Code Optimization" },
  { question: "A DFA is used in?", options: ["Syntax Analysis", "Lexical Analysis", "Code Generation", "Linking"], answer: 1, topic: "Finite Automata" },
  { question: "Shift Reduce parser is a type of?", options: ["Top Down Parser", "Bottom Up Parser", "Recursive Parser", "Optimizer"], answer: 1, topic: "Shift Reduce Parser" },
  { question: "Context Free Grammar is used in?", options: ["Syntax Analysis", "Lexical Analysis", "Optimization", "Loader"], answer: 0, topic: "Context Free Grammar" },
  { question: "Peephole optimization works on?", options: ["Large loops", "Small code segments", "Whole program", "Grammar rules"], answer: 1, topic: "Peephole Optimization" },
  { question: "DAG is used for?", options: ["Tokenizing", "Parse tree", "Optimization", "Linking"], answer: 2, topic: "DAG" },
  { question: "Which analysis determines the 'meaning' of a program?", options: ["Lexical", "Syntax", "Semantic", "Code Gen"], answer: 2, topic: "Semantic Analysis" },
  { question: "Regular expressions are used in which phase?", options: ["Parsing", "Lexical Analysis", "Optimization", "IR Generation"], answer: 1, topic: "Regular Expressions" },
  { question: "Which parser reads input left-to-right and constructs leftmost derivation?", options: ["LR Parser", "LL Parser", "SLR Parser", "LALR Parser"], answer: 1, topic: "LL(1) Parser" },
  { question: "Syntax Directed Translation is associated with?", options: ["Lexical Analysis", "Semantic rules attached to grammar", "Code Optimization", "Register Allocation"], answer: 1, topic: "Syntax Directed Translation" },
  { question: "Loop invariant code motion is a type of?", options: ["Peephole Opt", "Loop Optimization", "Dead Code Elimination", "Constant Folding"], answer: 1, topic: "Loop Optimization" },
  { question: "Data flow analysis is used for?", options: ["Token generation", "Type checking", "Optimization opportunities", "Grammar validation"], answer: 2, topic: "Data Flow Analysis" },
  { question: "Register allocation aims to?", options: ["Parse tokens", "Minimize register usage", "Build parse tree", "Generate IR"], answer: 1, topic: "Register Allocation" },
  { question: "An NFA can be converted to a DFA using?", options: ["Thompson's construction", "Subset construction", "Reduction", "Normalization"], answer: 1, topic: "Finite Automata" },
  { question: "The handle in a shift-reduce parser is?", options: ["A terminal", "A production's RHS matching stack top", "The start symbol", "A lookahead"], answer: 1, topic: "Shift Reduce Parser" },
  { question: "Dead code elimination removes?", options: ["All loops", "Unreachable code", "All variables", "Comments"], answer: 1, topic: "Code Optimization" },
  { question: "Which phase assigns addresses to variables?", options: ["Lexical", "Syntax", "Code Generation", "Semantic"], answer: 2, topic: "Code Optimization" },
  { question: "A symbol table is primarily used during?", options: ["Only Lexical", "All phases", "Only Optimization", "Only Code Gen"], answer: 1, topic: "Phases of Compiler" },
  { question: "Ambiguous grammar has?", options: ["No parse tree", "Exactly one parse tree", "More than one parse tree", "Only leaves"], answer: 2, topic: "Context Free Grammar" },
  { question: "Strength reduction replaces?", options: ["Weak ops with strong", "Expensive ops with cheaper", "Variables with constants", "Loops with recursion"], answer: 1, topic: "Code Optimization" },
  { question: "The front end of a compiler includes?", options: ["Code Gen + Opt", "Lexical + Syntax + Semantic", "Only Lexical", "Only Optimization"], answer: 1, topic: "Phases of Compiler" },
];

export function getShuffledQuestions(count: number = 15): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
