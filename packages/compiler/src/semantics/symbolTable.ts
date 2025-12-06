export interface Symbol {
    name: string;
    type: string; // 'int', 'bool', 'void'
    kind: 'variable' | 'function' | 'parameter';
    scopeLevel: number;
}

export class SymbolTable {
    private scopes: Map<string, Symbol>[] = [];
    private currentLevel: number = 0;

    constructor() {
        this.enterScope(); // Global scope
    }

    public enterScope() {
        this.scopes.push(new Map());
        this.currentLevel++;
    }

    public leaveScope() {
        this.scopes.pop();
        this.currentLevel--;
    }

    public define(name: string, type: string, kind: 'variable' | 'function' | 'parameter'): Symbol {
        const scope = this.scopes[this.scopes.length - 1];
        const symbol: Symbol = { name, type, kind, scopeLevel: this.currentLevel };
        scope.set(name, symbol);
        return symbol;
    }

    public resolve(name: string): Symbol | undefined {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const scope = this.scopes[i];
            if (scope.has(name)) {
                return scope.get(name);
            }
        }
        return undefined;
    }

    public isDefinedInCurrentScope(name: string): boolean {
        const scope = this.scopes[this.scopes.length - 1];
        return scope.has(name);
    }

    public getAllSymbols(): Symbol[] {
        const allSymbols: Symbol[] = [];
        this.scopes.forEach(scope => {
            scope.forEach(symbol => {
                allSymbols.push(symbol);
            });
        });
        return allSymbols;
    }

    public getScopeLevels(): number {
        return this.scopes.length;
    }
}
