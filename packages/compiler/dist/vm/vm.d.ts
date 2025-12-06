import { IRProgram } from '../ir/ir';
export declare class VM {
    private stack;
    private env;
    private ip;
    private instructions;
    private output;
    private isRunning;
    private program;
    constructor(program?: IRProgram);
    load(program: IRProgram): void;
    reset(): void;
    run(): void;
    step(): void;
    getStack(): any[];
    getEnv(): Map<string, any>;
    getOutput(): string[];
    getIP(): number;
}
