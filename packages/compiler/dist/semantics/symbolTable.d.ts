export interface Symbol {
    name: string;
    type: string;
    kind: 'variable' | 'function' | 'parameter';
    scopeLevel: number;
}
export declare class SymbolTable {
    private scopes;
    private currentLevel;
    constructor();
    enterScope(): void;
    leaveScope(): void;
    define(name: string, type: string, kind: 'variable' | 'function' | 'parameter'): Symbol;
    resolve(name: string): Symbol | undefined;
    isDefinedInCurrentScope(name: string): boolean;
    getAllSymbols(): Symbol[];
    getScopeLevels(): number;
}
