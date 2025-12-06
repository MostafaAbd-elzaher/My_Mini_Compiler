"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRProgram = exports.OpCode = void 0;
var OpCode;
(function (OpCode) {
    OpCode["CONST"] = "CONST";
    OpCode["ADD"] = "ADD";
    OpCode["SUB"] = "SUB";
    OpCode["MUL"] = "MUL";
    OpCode["DIV"] = "DIV";
    OpCode["LT"] = "LT";
    OpCode["GT"] = "GT";
    OpCode["EQ"] = "EQ";
    OpCode["NOT"] = "NOT";
    OpCode["JMP"] = "JMP";
    OpCode["JZ"] = "JZ";
    OpCode["LOAD"] = "LOAD";
    OpCode["STORE"] = "STORE";
    OpCode["CALL"] = "CALL";
    OpCode["RET"] = "RET";
    OpCode["PRINT"] = "PRINT";
    OpCode["HALT"] = "HALT";
})(OpCode || (exports.OpCode = OpCode = {}));
class IRProgram {
    constructor() {
        this.instructions = [];
    }
    add(op, arg, comment) {
        this.instructions.push({ op, arg, comment });
    }
    toString() {
        return this.instructions.map((i, idx) => `${idx.toString().padStart(4, '0')} ${i.op.padEnd(6)} ${i.arg !== undefined ? i.arg : ''} ${i.comment ? '// ' + i.comment : ''}`).join('\n');
    }
}
exports.IRProgram = IRProgram;
