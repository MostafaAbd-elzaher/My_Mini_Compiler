import { IRProgram, OpCode, Instruction } from '../ir/ir';

export class VM {
    private stack: any[] = [];
    private env: Map<string, any> = new Map();
    private ip: number = 0; // Instruction Pointer
    private instructions: Instruction[] = [];
    private output: string[] = [];
    private isRunning: boolean = false;
    private program: IRProgram | undefined;

    constructor(program?: IRProgram) {
        if (program) {
            this.load(program);
        }
    }

    public load(program: IRProgram) {
        this.program = program;
        this.instructions = program.instructions;
        this.reset();
    }

    public reset() {
        this.stack = [];
        this.env = new Map();
        this.ip = 0;
        this.output = [];
        this.isRunning = true;
    }

    public run() {
        this.isRunning = true;
        while (this.isRunning && this.ip < this.instructions.length) {
            this.step();
        }
    }

    public step() {
        if (!this.isRunning || this.ip >= this.instructions.length) {
            return;
        }

        const instr = this.instructions[this.ip];
        this.ip++;

        switch (instr.op) {
            case OpCode.CONST:
                this.stack.push(instr.arg);
                break;
            case OpCode.ADD: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a + b);
                break;
            }
            case OpCode.SUB: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a - b);
                break;
            }
            case OpCode.MUL: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a * b);
                break;
            }
            case OpCode.DIV: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(Math.floor(a / b));
                break;
            }
            case OpCode.LT: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a < b);
                break;
            }
            case OpCode.GT: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a > b);
                break;
            }
            case OpCode.EQ: {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a === b);
                break;
            }
            case OpCode.NOT: {
                const a = this.stack.pop();
                this.stack.push(!a);
                break;
            }
            case OpCode.LOAD:
                if (typeof instr.arg === 'string') {
                    if (!this.env.has(instr.arg)) {
                        throw new Error(`Runtime Error: Undefined variable '${instr.arg}'`);
                    }
                    this.stack.push(this.env.get(instr.arg));
                }
                break;
            case OpCode.STORE:
                if (typeof instr.arg === 'string') {
                    const val = this.stack.pop();
                    this.env.set(instr.arg, val);
                }
                break;
            case OpCode.JMP:
                if (typeof instr.arg === 'number') {
                    this.ip = instr.arg;
                }
                break;
            case OpCode.JZ:
                const condition = this.stack.pop();
                if (!condition) {
                    if (typeof instr.arg === 'number') {
                        this.ip = instr.arg;
                    }
                }
                break;
            case OpCode.PRINT:
                const outputVal = this.stack.pop();
                this.output.push(String(outputVal));
                console.log('VM Output:', outputVal);
                break;
            case OpCode.HALT:
                this.isRunning = false;
                break;
            default:
                throw new Error(`Unknown OpCode: ${instr.op}`);
        }
    }

    public getStack(): any[] {
        return [...this.stack];
    }

    public getEnv(): Map<string, any> {
        return new Map(this.env);
    }

    public getOutput(): string[] {
        return this.output;
    }

    public getIP(): number {
        return this.ip;
    }
}
