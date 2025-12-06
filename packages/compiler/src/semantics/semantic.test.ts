import { Lexer } from '../lexer/lexer';
import { Parser } from '../parser/parser';
import { SemanticAnalyzer } from './semantic';

describe('Semantic Analyzer', () => {
  
  test('Valid Program - Variable Declaration and Output', () => {
    const input = `
      int x = 5;
      int y = 10;
      if (x < y) {
        Console.WriteLine("x is smaller");
      }
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

  test('Valid Program - Arithmetic Operations', () => {
    const input = `
      int a = 10;
      int b = 20;
      int sum = a + b;
      Console.WriteLine(sum);
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

  test('Valid Program - Boolean Operations', () => {
    const input = `
      bool x = true;
      bool y = false;
      bool result = (x || y) && (x != y);
      Console.WriteLine(result);
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

  test('Valid Program - While Loop', () => {
    const input = `
      int i = 0;
      while (i < 5) {
        Console.WriteLine(i);
        i = i + 1;
      }
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

  test('Valid Program - String Concatenation', () => {
    const input = `
      string greeting = "Hello";
      string name = "World";
      string message = greeting + name;
      Console.WriteLine(message);
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

  
  // types error tests

  test('Error - Type Mismatch in Assignment', () => {
    const input = `
      int x = "hello";
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
    expect(analyzer.getErrors()[0]).toContain("Type mismatch");
  });

  test('Error - Invalid Arithmetic Operation', () => {
    const input = `
      bool x = true;
      int y = x + 5;
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
  });

  test('Error - Invalid Boolean Operation', () => {
    const input = `
      int x = 5;
      bool result = (x && true);
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
  });

  test('Error - Wrong Operand Type for Negation', () => {
    const input = `
      int x = 5;
      int y = -x;
      int z = !"hello";
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
  });

  // undefined variable tests

  test('Error - Undefined Variable', () => {
    const input = `
      Console.WriteLine(z);
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
    expect(analyzer.getErrors()[0]).toContain("not defined");
  });

  test('Error - Assignment to Undefined Variable', () => {
    const input = `
      undefinedVar = 10;
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
    expect(analyzer.getErrors()[0]).toContain("not defined");
  });


  //redefinition tests

  test('Error - Redefinition in Same Scope', () => {
    const input = `
      int x = 5;
      int x = 10;
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
    expect(analyzer.getErrors()[0]).toContain("already defined");
  });

  test('Valid - Same Variable Name in Different Scopes', () => {
    const input = `
      int x = 5;
      {
        int x = 10;
        Console.WriteLine(x);
      }
      Console.WriteLine(x);
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

// condition tests
  test('Error - Non-Boolean Condition in If', () => {
    const input = `
      if (5) {
        Console.WriteLine("test");
      }
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
    expect(analyzer.getErrors()[0]).toContain("Condition must be boolean");
  });

  test('Error - Non-Boolean Condition in While', () => {
    const input = `
      while ("test") {
        Console.WriteLine("loop");
      }
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
    expect(analyzer.getErrors()[0]).toContain("Condition must be boolean");
  });


  // advanced tests

  test('Valid - Complex Nested Structure', () => {
    const input = `
      int x = 10;
      if (x > 5) {
        int y = 20;
        while (y > 0) {
          y = y - 1;
        }
        Console.WriteLine(y);
      }
      Console.WriteLine(x);
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

  test('Valid - Comparison Operations', () => {
    const input = `
      int a = 10;
      int b = 20;
      bool result1 = a < b;
      bool result2 = a > b;
      bool result3 = a == b;
      bool result4 = a != b;
      bool result5 = a <= b;
      bool result6 = a >= b;
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });

  test('Error - Type Mismatch in Comparison', () => {
    const input = `
      int x = 5;
      bool result = x < "10";
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors().length).toBeGreaterThan(0);
  });

  test('Valid - Unary Operations', () => {
    const input = `
      int x = 10;
      int negated = -x;
      bool flag = true;
      bool inverted = !flag;
    `;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    const analyzer = new SemanticAnalyzer();
    analyzer.check(program);

    expect(analyzer.getErrors()).toHaveLength(0);
  });
});
