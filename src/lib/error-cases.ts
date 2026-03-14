export interface ErrorCase {
  code: string;
  errorType: "Lexical Error" | "Syntax Error" | "Semantic Error" | "Logical Error";
  explanation: string;
}

export const ERROR_CASES: ErrorCase[] = [
  { code: 'int 123abc = 5;', errorType: "Lexical Error", explanation: "Identifiers cannot start with a digit. '123abc' is an invalid token." },
  { code: 'int a = 5 +;', errorType: "Syntax Error", explanation: "Missing operand after '+'. The expression is grammatically incorrect." },
  { code: 'int a = "hello";', errorType: "Semantic Error", explanation: "Type mismatch: cannot assign a string literal to an integer variable." },
  { code: 'int a = 5 / 0;', errorType: "Logical Error", explanation: "Division by zero will cause a runtime error. The code is syntactically valid." },
  { code: 'int a = 5;\nint a = 10;', errorType: "Semantic Error", explanation: "Duplicate declaration of variable 'a' in the same scope." },
  { code: 'int a = @5;', errorType: "Lexical Error", explanation: "'@' is not a valid character in C. The lexer cannot recognize this symbol." },
  { code: 'int a = (5 + 3;', errorType: "Syntax Error", explanation: "Missing closing parenthesis. Unbalanced brackets are a syntax error." },
  { code: 'float x = 5;\nint y = x;', errorType: "Semantic Error", explanation: "Implicit narrowing conversion from float to int may cause data loss." },
  { code: 'if(x > 5) { y = 1; } else { y = 1; }', errorType: "Logical Error", explanation: "Both branches produce the same result, making the condition meaningless." },
  { code: 'int a = 5 $ 3;', errorType: "Lexical Error", explanation: "'$' is not a valid operator in C. The lexer cannot tokenize this." },
  { code: 'int a = ;', errorType: "Syntax Error", explanation: "Missing expression after '='. Assignment requires a right-hand value." },
  { code: 'while(1) { i++; }', errorType: "Logical Error", explanation: "Infinite loop with no break condition. Program will never terminate." },
  { code: 'int #var = 5;', errorType: "Lexical Error", explanation: "'#' is not valid in an identifier. Invalid token for variable name." },
  { code: 'int a = 5\nint b = 3;', errorType: "Syntax Error", explanation: "Missing semicolon at end of first statement." },
  { code: 'char c = 256;', errorType: "Semantic Error", explanation: "Value 256 exceeds char range (0-255). Type overflow error." },
  { code: 'int x = 5; if(x = 5) {}', errorType: "Logical Error", explanation: "Assignment '=' used instead of comparison '==' in condition." },
  { code: 'int a = 0x$$;', errorType: "Lexical Error", explanation: "Invalid hex literal. '$' is not a valid hexadecimal digit." },
  { code: 'for(int i=0 i<10; i++) {}', errorType: "Syntax Error", explanation: "Missing semicolon between for-loop initializer and condition." },
  { code: 'void f() { return 5; }', errorType: "Semantic Error", explanation: "Returning a value from void function. Type mismatch." },
  { code: 'int arr[10]; arr[10] = 5;', errorType: "Logical Error", explanation: "Array index out of bounds. arr[10] accesses beyond array size of 10." },
];

export const ERROR_TYPES = ["Lexical Error", "Syntax Error", "Semantic Error", "Logical Error"] as const;

export function getShuffledErrors(): ErrorCase[] {
  const arr = [...ERROR_CASES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
