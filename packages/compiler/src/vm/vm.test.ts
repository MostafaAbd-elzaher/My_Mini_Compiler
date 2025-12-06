import { VM } from './vm';
import { OpCode, IRProgram } from '../ir/ir';

describe('Virtual Machine', () => {
    test('Arithmetic Execution', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 5);
        program.add(OpCode.CONST, 10);
        program.add(OpCode.ADD);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();

        const stack = vm.getStack();
        expect(stack.length).toBe(1);
        expect(stack[0]).toBe(15);
    });

    test('Subtraction', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 20);
        program.add(OpCode.CONST, 5);
        program.add(OpCode.SUB);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        expect(vm.getStack()[0]).toBe(15);
    });

    test('Multiplication', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 6);
        program.add(OpCode.CONST, 7);
        program.add(OpCode.MUL);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        expect(vm.getStack()[0]).toBe(42);
    });

    test('Division', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 20);
        program.add(OpCode.CONST, 4);
        program.add(OpCode.DIV);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        expect(vm.getStack()[0]).toBe(5);
    });

    test('Variable Storage and Loading', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 42);
        program.add(OpCode.STORE, 'x');
        program.add(OpCode.LOAD, 'x');
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        expect(vm.getEnv().get('x')).toBe(42);
    });

    test('Comparisons', () => {
        // Test: 5 < 10
        const program = new IRProgram();
        program.add(OpCode.CONST, 5);
        program.add(OpCode.CONST, 10);
        program.add(OpCode.LT);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        expect(vm.getStack()[0]).toBe(true);
    });

    test('Equality Check', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 10);
        program.add(OpCode.CONST, 10);
        program.add(OpCode.EQ);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        expect(vm.getStack()[0]).toBe(true);
    });

    test('Logical NOT', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 1); // Use 1 instead of true
        program.add(OpCode.NOT);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        expect(vm.getStack()[0]).toBe(false);
    });

    test('String Output', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, "Hello World");
        program.add(OpCode.PRINT);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();

        expect(vm.getOutput()).toContain("Hello World");
    });

    test('Conditional Jump', () => {
        // if 5 < 10 (true): jump to instruction 5 else continue
        // The result is true (1), so we jump
        const program = new IRProgram();
        program.add(OpCode.CONST, 5);
        program.add(OpCode.CONST, 10);
        program.add(OpCode.LT);  // This returns 1 (true)
        program.add(OpCode.JZ, 5);  // Jump if result is 0 (false) - should NOT jump
        program.add(OpCode.CONST, 100);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();
        // The condition is true, so we don't jump, and 100 gets pushed to stack
        expect(vm.getStack().length).toBeGreaterThan(0);
    });

    test('Complex Program', () => {
        const program = new IRProgram();
        program.add(OpCode.CONST, 10);
        program.add(OpCode.STORE, 'x');
        program.add(OpCode.CONST, 5);
        program.add(OpCode.STORE, 'y');
        program.add(OpCode.LOAD, 'x');
        program.add(OpCode.LOAD, 'y');
        program.add(OpCode.ADD);
        program.add(OpCode.PRINT);
        program.add(OpCode.HALT);

        const vm = new VM(program);
        vm.run();

        expect(vm.getEnv().get('x')).toBe(10);
        expect(vm.getEnv().get('y')).toBe(5);
        expect(vm.getOutput()).toContain('15');
    });
});
