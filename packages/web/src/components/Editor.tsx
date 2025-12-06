import React from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';

interface CodeEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        
        monaco.editor.defineTheme('minilang-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: '569cd6' },
                { token: 'string', foreground: 'ce9178' },
                { token: 'number', foreground: 'b5cea8' },
                { token: 'comment', foreground: '6a9955' },
            ],
            colors: {
                'editor.background': '#1e293b',
                'editor.foreground': '#e2e8f0',
                'editor.lineHighlightBackground': '#0f172a',
                'editorLineNumber.foreground': '#64748b',
            },
        });
    };

    return (
        <div style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            borderRadius: '0.5rem',
            border: '1px solid #334155',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <Editor
                height="100%"
                width="100%"
                defaultLanguage="csharp"
                theme="minilang-dark"
                value={code}
                onChange={onChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    automaticLayout: true,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    bracketPairColorization: { enabled: true },
                    'bracketPairColorization.independentColorPoolPerBracketType': true,
                }}
            />
        </div>
    );
};
