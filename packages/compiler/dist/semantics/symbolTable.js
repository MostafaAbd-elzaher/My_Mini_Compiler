"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTable = void 0;
class SymbolTable {
    constructor() {
        this.scopes = [];
        this.currentLevel = 0;
        this.enterScope(); // Global scope
    }
    enterScope() {
        this.scopes.push(new Map());
        this.currentLevel++;
    }
    leaveScope() {
        this.scopes.pop();
        this.currentLevel--;
    }
    define(name, type, kind) {
        const scope = this.scopes[this.scopes.length - 1];
        const symbol = { name, type, kind, scopeLevel: this.currentLevel };
        scope.set(name, symbol);
        return symbol;
    }
    resolve(name) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const scope = this.scopes[i];
            if (scope.has(name)) {
                return scope.get(name);
            }
        }
        return undefined;
    }
    isDefinedInCurrentScope(name) {
        const scope = this.scopes[this.scopes.length - 1];
        return scope.has(name);
    }
    getAllSymbols() {
        const allSymbols = [];
        this.scopes.forEach(scope => {
            scope.forEach(symbol => {
                allSymbols.push(symbol);
            });
        });
        return allSymbols;
    }
    getScopeLevels() {
        return this.scopes.length;
    }
}
exports.SymbolTable = SymbolTable;
