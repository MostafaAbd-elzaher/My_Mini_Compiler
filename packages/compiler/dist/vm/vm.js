"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VM = void 0;
const ir_1 = require("../ir/ir");
class VM {
    constructor(program) {
        this.stack = [];
        this.env = new Map();
        this.ip = 0; // Instruction Pointer
        this.instructions = [];
        this.output = [];
        this.isRunning = false;
        if (program) {
            this.load(program);
        }
    }
    load(program) {
        this.program = program;
        this.instructions = program.instructions;
        this.reset();
    }
    reset() {
        this.stack = [];
        this.env = new Map();
        this.ip = 0;
        this.output = [];
        this.isRunning = true;
    }
    run() {
        this.isRunning = true;
        while (this.isRunning && this.ip < this.instructions.length) {
            this.step();
        }
    }
    step() {
        if (!this.isRunning || this.ip >= this.instructions.length) {
            return;
        }
        const instr = this.instructions[this.ip];
        this.ip++;
        switch (instr.op) {
            case ir_1.OpCode.CONST:
                this.stack.push(instr.arg);
                break;
            case ir_1.OpCode.ADD: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a + b);
                break;
            }
            case ir_1.OpCode.SUB: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a - b);
                break;
            }
            case ir_1.OpCode.MUL: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a * b);
                break;
            }
            case ir_1.OpCode.DIV: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(Math.floor(a / b));
                break;
            }
            case ir_1.OpCode.LT: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a < b);
                break;
            }
            case ir_1.OpCode.GT: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a > b);
                break;
            }
            case ir_1.OpCode.EQ: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a === b);
                break;
            }
            case ir_1.OpCode.NOT: {
                const a = this.stack.pop();
                this.stack.push(!a);
                break;
            }
            case ir_1.OpCode.LOAD:
                if (typeof instr.arg === 'string') {
                    if (!this.env.has(instr.arg)) {
                        throw new Error(`Runtime Error: Undefined variable '${instr.arg}'`);
                    }
                    this.stack.push(this.env.get(instr.arg));
                }
                break;
            case ir_1.OpCode.STORE:
                if (typeof instr.arg === 'string') {
                    const val = this.stack.pop();
                    this.env.set(instr.arg, val);
                }
                break;
            case ir_1.OpCode.JMP:
                if (typeof instr.arg === 'number') {
                    this.ip = instr.arg;
                }
                break;
            case ir_1.OpCode.JZ:
                const condition = this.stack.pop();
                if (!condition) {
                    if (typeof instr.arg === 'number') {
                        this.ip = instr.arg;
                    }
                }
                break;
            case ir_1.OpCode.PRINT:
                const outputVal = this.stack.pop();
                this.output.push(String(outputVal));
                console.log('VM Output:', outputVal);
                break;
            case ir_1.OpCode.HALT:
                this.isRunning = false;
                break;
            default:
                throw new Error(`Unknown OpCode: ${instr.op}`);
        }
    }
    getStack() {
        return [...this.stack];
    }
    getEnv() {
        return new Map(this.env);
    }
    getOutput() {
        return this.output;
    }
    getIP() {
        return this.ip;
    }
}
exports.VM = VM;
