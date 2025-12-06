export declare enum OpCode {
    CONST = "CONST",
    ADD = "ADD",
    SUB = "SUB",
    MUL = "MUL",
    DIV = "DIV",
    LT = "LT",
    GT = "GT",
    EQ = "EQ",
    NOT = "NOT",
    JMP = "JMP",
    JZ = "JZ",// Jump if zero (false)
    LOAD = "LOAD",
    STORE = "STORE",
    CALL = "CALL",
    RET = "RET",
    PRINT = "PRINT",// For debugging/output
    HALT = "HALT"
}
export interface Instruction {
    op: OpCode;
    arg?: number | string | boolean;
    comment?: string;
}
export declare class IRProgram {
    instructions: Instruction[];
    add(op: OpCode, arg?: number | string, comment?: string): void;
    toString(): string;
}
