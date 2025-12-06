import { Lexer } from '../lexer/lexer';
import { Parser } from './parser';
import * as AST from './ast';

describe('Parser', () => {
    test('Variable Declarations ', () => {
        const input = `int x = 5; string s = "hello"; bool flag = true;`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(3);
        expect((program.statements[0] as AST.VariableDeclaration).varType).toBe('int');
        expect((program.statements[1] as AST.VariableDeclaration).varType).toBe('string');
        expect((program.statements[2] as AST.VariableDeclaration).varType).toBe('bool');
    });

    test('If Statement -  ', () => {
        const input = `if (x > 5) { Console.WriteLine(x); } else { Console.WriteLine(0); }`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0] as AST.IfStatement;
        expect(stmt.type).toBe('IfStatement');
        expect(stmt.alternative).toBeDefined();
    });

    test('While Loop ', () => {
        const input = `while (i < 10) { i = i + 1; }`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0] as AST.WhileStatement;
        expect(stmt.type).toBe('WhileStatement');
    });

    test('Arithmetic Expressions ', () => {
        const input = `int result = a + b * c - d / e;`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0] as AST.VariableDeclaration;
        expect(stmt.value?.type).toBe('InfixExpression');
    });

    test('Boolean Operations ', () => {
        const input = `bool result = (x > 5) && (y < 10);`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0] as AST.VariableDeclaration;
        expect(stmt.value?.type).toBe('InfixExpression');
    });

    test('Console.WriteLine ', () => {
        const input = `Console.WriteLine("Hello World");`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0] as AST.ConsoleWriteLine;
        expect(stmt.type).toBe('ConsoleWriteLine');
    });

    test('Block Statements ', () => {
        const input = `{ int x = 5; int y = 10; }`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0] as AST.BlockStatement;
        expect(stmt.type).toBe('BlockStatement');
        expect(stmt.statements.length).toBe(2);
    });

    test('Complex Nested Structure ', () => {
        const input = `
            int x = 10;
            if (x > 5) {
                while (x > 0) {
                    x = x - 1;
                }
            }
        `;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(2);
    });

    test('Assignment Statement ', () => {
        const input = `x = 5; y = x + 10;`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(2);
        expect((program.statements[0] as AST.AssignmentStatement).type).toBe('AssignmentStatement');
    });

    test('Unary Operations ', () => {
        const input = `int neg = -5; bool inv = !true;`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(2);
    });

    test('Multiple If-Else Chains ', () => {
        const input = `if (x > 10) { } else { if (x > 5) { } }`;
        const l = new Lexer(input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
    });
});

function checkParserErrors(p: Parser) {
    const errors = p.getErrors();
    if (errors.length === 0) {
        return;
    }
    throw new Error(`Parser has errors: ${errors.join(', ')}`);
}
