import React, { useState } from 'react';
import { CodeEditor } from './components/Editor';
import { Controls } from './components/Controls';
import { StageVisualizer } from './components/StageVisualizer';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Lexer } from '@minilang/compiler/src/lexer/lexer';
import { Parser } from '@minilang/compiler/src/parser/parser';
import { SemanticAnalyzer } from '@minilang/compiler/src/semantics/semantic';
import { CodeGenerator } from '@minilang/compiler/src/codegen/codegen';
import { VM } from '@minilang/compiler/src/vm/vm';
import { Token } from '@minilang/compiler/src/lexer/token';
import './App.css';

const DEFAULT_CODE = `int x = 10;
int y = 20;
int sum = x + y;
Console.WriteLine(sum);

if (sum > 25) {
    Console.WriteLine("Sum is greater than 25");
} else {
    Console.WriteLine("Sum is small");
}`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [astStr, setAstStr] = useState('');
  const [parseTree, setParseTree] = useState<any>(null);
  const [bytecodeStr, setBytecodeStr] = useState('');
  const [symbolTable, setSymbolTable] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<'lexical' | 'syntax' | 'semantic' | 'codegen' | 'output'>('output');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [vm, setVm] = useState<VM | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleCompile = () => {
    setOutput([]);
    setTokens([]);
    setAstStr('');
    setParseTree(null);
    setBytecodeStr('');
    setSymbolTable(null);
    setIsCompiling(true);

    try {
      // 1. Lexer
      const lexer = new Lexer(code);
      const allTokens: Token[] = [];
      let tok = lexer.nextToken();
      while (tok.type !== 'EOF') {
        allTokens.push(tok);
        tok = lexer.nextToken();
      }
      setTokens(allTokens);

      // Re-create lexer for parser
      const parserLexer = new Lexer(code);
      const parser = new Parser(parserLexer);
      const program = parser.parseProgram();

      if (parser.getErrors().length > 0) {
        setOutput(parser.getErrors().map(e => `Syntax Error: ${e}`));
        setActiveStage('output');
        return;
      }
      setAstStr(program.toString());

      // Generate parse tree for visualization
      setParseTree(parser.getParseTreeJSON(program));

      // 3. Semantics
      const analyzer = new SemanticAnalyzer();
      analyzer.check(program);
      if (analyzer.getErrors().length > 0) {
        setOutput(analyzer.getErrors().map(e => `Semantic Error: ${e}`));
        setActiveStage('output');
        return;
      }

      // Extract symbol table
      setSymbolTable(analyzer.getSymbolTable());

      // 4. Codegen
      const codegen = new CodeGenerator();
      const ir = codegen.generate(program);
      setBytecodeStr(ir.toString());

      // 5. VM Setup
      const newVm = new VM({ instructions: ir.instructions });
      setVm(newVm);

      setOutput(['✓ Compilation successful! Click Run to execute.']);
      setActiveStage('codegen');
    } catch (e: any) {
      setOutput([`✗ Error: ${e.message}`]);
      setActiveStage('output');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleRun = () => {
    if (!vm) {
      handleCompile();
      return;
    }
    setIsRunning(true);
    vm.reset();
    vm.run();
    setOutput(vm.getOutput());
    setActiveStage('output');
    setIsRunning(false);
  };

  const handleStep = () => {
    if (!vm) return;
    vm.step();
    setOutput(vm.getOutput());
    setActiveStage('output');
  };

  const handleReset = () => {
    setCode('');
    setTokens([]);
    setAstStr('');
    setParseTree(null);
    setBytecodeStr('');
    setOutput([]);
    setVm(null);
  };

  const handleSave = () => {
    localStorage.setItem('minilang_code', code);
    alert('Code saved locally!');
  };

  const handleExport = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code));
    element.setAttribute('download', 'code.mini');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadTemplate = (templateCode: string) => {
    setCode(templateCode);
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      transition: 'all 0.3s'
    }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            onLoadTemplate={handleLoadTemplate}
          />
        )}

        {/* Main Editor Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden'
        }}>
          {/* Controls */}
          <Controls
            onCompile={handleCompile}
            onRun={handleRun}
            onStep={handleStep}
            onReset={handleReset}
            onSave={handleSave}
            onExport={handleExport}
            isCompiling={isCompiling}
            isRunning={isRunning}
          />

          {/* Editor and Visualizer */}
          <div style={{
            flex: 1,
            padding: '1rem',
            minHeight: 0,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            {/* Editor Panel */}
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Code Editor
              </div>
              <div style={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden'
              }}>
                <CodeEditor code={code} onChange={(val) => setCode(val || '')} />
              </div>
            </div>

            {/* Visualizer Panel */}
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Compilation Stages
              </div>
              <div style={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden'
              }}>
                <StageVisualizer
                  tokens={tokens}
                  ast={astStr}
                  parseTree={parseTree}
                  symbolTable={symbolTable}
                  bytecode={bytecodeStr}
                  output={output}
                  activeStage={activeStage}
                  onStageChange={setActiveStage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
