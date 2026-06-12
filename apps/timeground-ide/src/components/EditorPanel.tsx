import Editor from "@monaco-editor/react";
import { X } from "lucide-react";
import type { OpenFile } from "../types";
import { LANGUAGE_MAP } from "../types";
import type { EditorSettings } from "../settings";
import "./EditorPanel.css";

interface Props {
  openFiles: OpenFile[];
  activeIndex: number;
  onSelectTab: (index: number) => void;
  onCloseTab: (index: number) => void;
  onChange: (content: string) => void;
  activeFile: OpenFile | null;
  editorSettings?: EditorSettings;
}

export function EditorPanel({
  openFiles,
  activeIndex,
  onSelectTab,
  onCloseTab,
  onChange,
  activeFile,
  editorSettings,
}: Props) {
  const fontSize = editorSettings?.fontSize ?? 14;
  const tabSize = editorSettings?.tabSize ?? 4;
  const wordWrap = editorSettings?.wordWrap ?? false;
  const minimap = editorSettings?.minimap ?? true;
  return (
    <div className="editor-panel">
      {openFiles.length > 0 && (
        <div className="tab-bar">
          {openFiles.map((file, i) => (
            <div
              key={file.path}
              className={`tab ${i === activeIndex ? "active" : ""}`}
              onClick={() => onSelectTab(i)}
            >
              <span className="tab-name">
                {file.name}
                {file.dirty && <span className="tab-dirty">●</span>}
              </span>
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(i);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="editor-container">
        {activeFile ? (
          <Editor
            height="100%"
            language={LANGUAGE_MAP[activeFile.language] ?? "plaintext"}
            value={activeFile.content}
            onChange={(v) => onChange(v ?? "")}
            theme="vs-dark"
            options={{
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontSize,
              tabSize,
              lineHeight: Math.round(fontSize * 1.55),
              wordWrap: wordWrap ? "on" : "off",
              minimap: { enabled: minimap, scale: 0.8 },
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              bracketPairColorization: { enabled: true },
              renderLineHighlight: "all",
              automaticLayout: true,
            }}
          />
        ) : (
          <div className="editor-empty">
            <p>Open a file from the explorer to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
}
