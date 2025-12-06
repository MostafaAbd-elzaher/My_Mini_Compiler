export enum OpCode {
    CONST = 'CONST',
    ADD = 'ADD',
    SUB = 'SUB',
    MUL = 'MUL',
    DIV = 'DIV',
    LT = 'LT',
    GT = 'GT',
    EQ = 'EQ',
    NOT = 'NOT',
    JMP = 'JMP',
    JZ = 'JZ', // Jump if zero (false)
    LOAD = 'LOAD',
    STORE = 'STORE',
    CALL = 'CALL',
    RET = 'RET',
    PRINT = 'PRINT', // For debugging/output
    HALT = 'HALT'
}

export interface Instruction {
    op: OpCode;
    arg?: number | string | boolean; // Immediate value or label/variable name
    comment?: string;
}

export class IRProgram {
    instructions: Instruction[] = [];

    add(op: OpCode, arg?: number | string, comment?: string) {
        this.instructions.push({ op, arg, comment });
    }

    toString(): string {
        return this.instructions.map((i, idx) =>
            `${idx.toString().padStart(4, '0')} ${i.op.padEnd(6)} ${i.arg !== undefined ? i.arg : ''} ${i.comment ? '// ' + i.comment : ''}`
        ).join('\n');
    }
}
