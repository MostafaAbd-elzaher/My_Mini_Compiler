"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNonTerminal = createNonTerminal;
exports.createTerminal = createTerminal;
exports.parseTreeToString = parseTreeToString;
exports.parseTreeToJSON = parseTreeToJSON;
/**
 * Creates a non-terminal parse tree node
 */
function createNonTerminal(label, children) {
    return {
        label,
        children,
        isTerminal: false
    };
}
/**
 * Creates a terminal parse tree node (leaf)
 */
function createTerminal(label, value, tokenType, line, column) {
    return {
        label,
        value,
        children: [],
        isTerminal: true,
        tokenType,
        line,
        column
    };
}
/**
 * Converts a parse tree to a formatted string representation
 */
function parseTreeToString(node, indent = '', isLast = true) {
    const prefix = indent + (isLast ? '└── ' : '├── ');
    const childIndent = indent + (isLast ? '    ' : '│   ');
    let result = prefix;
    if (node.isTerminal) {
        result += `[${node.label}] "${node.value}"`;
        if (node.tokenType) {
            result += ` (${node.tokenType})`;
        }
    }
    else {
        result += `<${node.label}>`;
    }
    result += '\n';
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isLastChild = i === node.children.length - 1;
        result += parseTreeToString(child, childIndent, isLastChild);
    }
    return result;
}
/**
 * Converts a parse tree to a JSON-serializable object for visualization
 */
function parseTreeToJSON(node) {
    return {
        name: node.isTerminal ? `${node.label}: ${node.value}` : node.label,
        label: node.label,
        value: node.value,
        isTerminal: node.isTerminal,
        tokenType: node.tokenType,
        line: node.line,
        column: node.column,
        children: node.children.map(parseTreeToJSON)
    };
}
