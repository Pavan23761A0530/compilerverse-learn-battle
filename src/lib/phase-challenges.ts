// 10 unique phase challenge examples

export interface PhaseChallenge {
  input: string;
  steps: string[];
}

export const PHASE_CHALLENGES: PhaseChallenge[] = [
  {
    input: "int a = 5 + 3;",
    steps: [
      "Tokens: int | a | = | 5 | + | 3 | ;",
      "Parse Tree: = → (a, + → (5, 3))",
      "Type Checking: int = int ✓",
      "t1 = 5 + 3 ; a = t1",
      "a = 8 (Constant Folding)",
      "MOV R1, #8 ; STORE R1, a",
    ],
  },
  {
    input: "float x = 10.5 * 2;",
    steps: [
      "Tokens: float | x | = | 10.5 | * | 2 | ;",
      "Parse Tree: = → (x, * → (10.5, 2))",
      "Type Checking: float = float ✓ (int 2 coerced)",
      "t1 = 10.5 * 2 ; x = t1",
      "x = 21.0 (Constant Folding)",
      "FMOV F1, #21.0 ; FSTORE F1, x",
    ],
  },
  {
    input: "int sum = b + c;",
    steps: [
      "Tokens: int | sum | = | b | + | c | ;",
      "Parse Tree: = → (sum, + → (b, c))",
      "Type Checking: int = int + int ✓",
      "t1 = b + c ; sum = t1",
      "sum = b + c (No constant folding possible)",
      "LOAD R1, b ; LOAD R2, c ; ADD R3, R1, R2 ; STORE R3, sum",
    ],
  },
  {
    input: "int n = 4 * (2 + 3);",
    steps: [
      "Tokens: int | n | = | 4 | * | ( | 2 | + | 3 | ) | ;",
      "Parse Tree: = → (n, * → (4, + → (2, 3)))",
      "Type Checking: int = int ✓",
      "t1 = 2 + 3 ; t2 = 4 * t1 ; n = t2",
      "n = 20 (Constant Folding)",
      "MOV R1, #20 ; STORE R1, n",
    ],
  },
  {
    input: "double y = 3.14 / 2;",
    steps: [
      "Tokens: double | y | = | 3.14 | / | 2 | ;",
      "Parse Tree: = → (y, / → (3.14, 2))",
      "Type Checking: double = double ✓ (int 2 coerced)",
      "t1 = 3.14 / 2 ; y = t1",
      "y = 1.57 (Constant Folding)",
      "FDIV F1, #3.14, #2.0 ; FSTORE F1, y",
    ],
  },
  {
    input: "int z = a - 1;",
    steps: [
      "Tokens: int | z | = | a | - | 1 | ;",
      "Parse Tree: = → (z, - → (a, 1))",
      "Type Checking: int = int - int ✓",
      "t1 = a - 1 ; z = t1",
      "z = a - 1 (No constant folding possible)",
      "LOAD R1, a ; SUB R2, R1, #1 ; STORE R2, z",
    ],
  },
  {
    input: "char c = 'A';",
    steps: [
      "Tokens: char | c | = | 'A' | ;",
      "Parse Tree: = → (c, 'A')",
      "Type Checking: char = char ✓",
      "c = 'A'",
      "c = 65 (Character to ASCII)",
      "MOV R1, #65 ; STORE R1, c",
    ],
  },
  {
    input: "int r = 10 % 3;",
    steps: [
      "Tokens: int | r | = | 10 | % | 3 | ;",
      "Parse Tree: = → (r, % → (10, 3))",
      "Type Checking: int = int ✓",
      "t1 = 10 % 3 ; r = t1",
      "r = 1 (Constant Folding)",
      "MOV R1, #1 ; STORE R1, r",
    ],
  },
  {
    input: "int p = 2 * 3 + 4;",
    steps: [
      "Tokens: int | p | = | 2 | * | 3 | + | 4 | ;",
      "Parse Tree: = → (p, + → (* → (2, 3), 4))",
      "Type Checking: int = int ✓",
      "t1 = 2 * 3 ; t2 = t1 + 4 ; p = t2",
      "p = 10 (Constant Folding)",
      "MOV R1, #10 ; STORE R1, p",
    ],
  },
  {
    input: "float area = 3.14 * r * r;",
    steps: [
      "Tokens: float | area | = | 3.14 | * | r | * | r | ;",
      "Parse Tree: = → (area, * → (* → (3.14, r), r))",
      "Type Checking: float = float ✓",
      "t1 = 3.14 * r ; t2 = t1 * r ; area = t2",
      "area = 3.14 * r * r (No constant folding, r is variable)",
      "FLOAD F1, r ; FMUL F2, #3.14, F1 ; FMUL F3, F2, F1 ; FSTORE F3, area",
    ],
  },
];

export function getRandomChallenge(usedIndices: number[]): { challenge: PhaseChallenge; index: number } | null {
  const available = PHASE_CHALLENGES.map((_, i) => i).filter(i => !usedIndices.includes(i));
  if (available.length === 0) return null;
  const idx = available[Math.floor(Math.random() * available.length)];
  return { challenge: PHASE_CHALLENGES[idx], index: idx };
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
