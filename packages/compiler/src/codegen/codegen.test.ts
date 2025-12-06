import { CodeGenerator } from './codegen';
import { Lexer } from '../lexer/lexer';
import { Parser } from '../parser/parser';
import { SemanticAnalyzer } from '../semantics/semantic';
import * as AST from '../parser/ast';

describe('CodeGenerator', () => {
    function parseAndAnalyze(input: string): AST.Program {
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();
        const analyzer = new SemanticAnalyzer();
        analyzer.check(program);
        return program;
    }

    test('Simple Variable Assignment', () => {
        const input = `int x = 5;`;
        const program = parseAndAnalyze(input);
        const codegen = new CodeGenerator();
        const ir = codegen.generate(program);

        expect(ir.instructions.length).toBeGreaterThan(0);
        expect(ir.instructions[ir.instructions.length - 1].op).toBe('HALT');
    });

    test('Arithmetic Operations', () => {
        const input = `int result = 5 + 10;`;
        const program = parseAndAnalyze(input);
        const codegen = new CodeGenerator();
        const ir = codegen.generate(program);

        expect(ir.instructions.length).toBeGreaterThan(2);
        const hasAdd = ir.instructions.some(instr => instr.op === 'ADD');
        expect(hasAdd).toBe(true);
    });

    test('If Statement', () => {
        const input = `if (x > 5) { int y = 10; }`;
        const program = parseAndAnalyze(input);
        const codegen = new CodeGenerator();
        const ir = codegen.generate(program);

        const hasJZ = ir.instructions.some(instr => instr.op === 'JZ');
        expect(hasJZ).toBe(true);
    });

    test('While Loop', () => {
        const input = `int i = 0; while (i < 5) { i = i + 1; }`;
        const program = parseAndAnalyze(input);
        const codegen = new CodeGenerator();
        const ir = codegen.generate(program);

        const hasJMP = ir.instructions.some(instr => instr.op === 'JMP');
        expect(hasJMP).toBe(true);
    });

    test('Console.WriteLine', () => {
        const input = `Console.WriteLine(10);`;
        const program = parseAndAnalyze(input);
        const codegen = new CodeGenerator();
        const ir = codegen.generate(program);

        const hasPrint = ir.instructions.some(instr => instr.op === 'PRINT');
        expect(hasPrint).toBe(true);
    });

    test('Multiple Operations', () => {
        const input = `int x = 10; int y = 20; int z = x + y;`;
        const program = parseAndAnalyze(input);
        const codegen = new CodeGenerator();
        const ir = codegen.generate(program);

        expect(ir.instructions.length).toBeGreaterThan(5);
    });

    test('Comparison Operations', () => {
        const input = `if (x > 5 && y < 10) { }`;
        const program = parseAndAnalyze(input);
        const codegen = new CodeGenerator();
        const ir = codegen.generate(program);

        const hasComparison = ir.instructions.some(instr => 
            instr.op === 'GT' || instr.op === 'LT'
        );
        expect(hasComparison).toBe(true);
    });
});
