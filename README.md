# MiniCSharp Compiler Project

**Created by Mostafa Abdelzaher**

## Overview
MiniCSharp is a simplified C#-like language compiler and web-based IDE. It features a complete compiler pipeline (Lexer, Parser, Semantic Analyzer, Code Generator) and a custom Stack-based Virtual Machine (VM) running entirely in the browser.

## Features
- **Modern Web IDE**: Built with React, TypeScript, and Monaco Editor.
- **Split-View Interface**: Code on the left, Compiler Stages on the right.
- **Stage Visualization**: View Tokens, AST, Generated Code, and Output.
- **In-Browser VM**: Execute compiled code directly in the browser.

## Language Syntax (MiniCSharp)
```csharp
int x = 10;
int y = 20;
if (x < y) {
    Console.WriteLine("x is smaller");
}
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- NPM

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm run dev --workspace=@minilang/web
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design documentation.
