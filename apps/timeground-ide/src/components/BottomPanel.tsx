import { useEffect, useRef, useState } from "react";
import {
  X,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronRight,
  AlertCircle,
  Plug,
} from "lucide-react";
import type { ConsoleEntry, OutputEntry, BottomPanelTab } from "../types";
import "./BottomPanel.css";

interface Props {
  open: boolean;
  tab: BottomPanelTab;
  height: number;
  maxHeight: number;
  onClose: () => void;
  onTabChange: (tab: BottomPanelTab) => void;
  onHeightChange: (height: number) => void;
}

const TABS: Array<{ id: BottomPanelTab; label: string }> = [
  { id: "problems", label: "Problems" },
  { id: "output", label: "Output" },
  { id: "debugConsole", label: "Debug Console" },
  { id: "terminal", label: "Terminal" },
  { id: "ports", label: "Ports" },
];

export function BottomPanel({
  open,
  tab,
  height,
  maxHeight,
  onClose,
  onTabChange,
  onHeightChange,
}: Props) {
  const [debugLogs, setDebugLogs] = useState<ConsoleEntry[]>([]);
  const [outputLogs, setOutputLogs] = useState<OutputEntry[]>([]);
  const [maximized, setMaximized] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const errorCount = debugLogs.filter((l) => l.level === "error").length;

  useEffect(() => {
    return window.timeground.onConsoleMessage((entry) => {
      setDebugLogs((prev) => [...prev, entry].slice(-800));
    });
  }, []);

  useEffect(() => {
    return window.timeground.onOutputMessage((entry) => {
      setOutputLogs((prev) => [...prev, entry].slice(-400));
    });
  }, []);

  useEffect(() => {
    if (tab === "debugConsole" || tab === "output") {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [debugLogs, outputLogs, tab]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;

    const onMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.clientY;
      onHeightChange(Math.min(maxHeight, Math.max(120, startHeight + delta)));
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const toggleMaximize = () => {
    if (maximized) {
      setMaximized(false);
      onHeightChange(280);
    } else {
      setMaximized(true);
      onHeightChange(maxHeight);
    }
  };

  if (!open) return null;

  const panelHeight = maximized ? maxHeight : height;

  return (
    <div className="bottom-panel" style={{ height: panelHeight }}>
      <div className="bottom-panel-resize" onMouseDown={startResize} title="Drag to resize" />

      <header className="bottom-panel-header">
        <div className="bottom-panel-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`bottom-panel-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => onTabChange(t.id)}
            >
              {t.label}
              {t.id === "problems" && errorCount > 0 && (
                <span className="bottom-panel-count">{errorCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="bottom-panel-actions">
          {tab === "debugConsole" && debugLogs.length > 0 && (
            <button
              className="bottom-panel-action"
              onClick={() => setDebugLogs([])}
              title="Clear"
            >
              <Trash2 size={14} />
            </button>
          )}
          {tab === "output" && outputLogs.length > 0 && (
            <button
              className="bottom-panel-action"
              onClick={() => setOutputLogs([])}
              title="Clear"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            className="bottom-panel-action"
            onClick={toggleMaximize}
            title={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button className="bottom-panel-action" onClick={onClose} title="Close panel">
            <X size={14} />
          </button>
        </div>
      </header>

      <div className="bottom-panel-body">
        {tab === "problems" && (
          <div className="panel-placeholder">
            <AlertCircle size={18} />
            <p>No problems have been detected in the workspace.</p>
          </div>
        )}

        {tab === "output" && (
          <div className="panel-log">
            {outputLogs.length === 0 ? (
              <p className="panel-empty">No output yet.</p>
            ) : (
              outputLogs.map((entry, i) => (
                <div
                  key={`${entry.timestamp}-${i}`}
                  className={`log-line level-${entry.level}`}
                >
                  <span className="log-source">{entry.source ?? "output"}</span>
                  <span className="log-message">{entry.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        )}

        {tab === "debugConsole" && (
          <div className="panel-log">
            {debugLogs.length === 0 ? (
              <p className="panel-empty">No messages in the debug console.</p>
            ) : (
              debugLogs.map((entry, i) => (
                <div
                  key={`${entry.timestamp}-${i}`}
                  className={`log-line level-${entry.level}`}
                >
                  <span className="log-message">{entry.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        )}

        {tab === "terminal" && (
          <div className="panel-terminal">
            <div className="terminal-output">
              <span className="log-message">TimeGround Code — integrated terminal</span>
            </div>
            <div className="terminal-prompt">
              <ChevronRight size={14} />
              <span className="terminal-cursor">_</span>
            </div>
          </div>
        )}

        {tab === "ports" && (
          <div className="panel-placeholder">
            <Plug size={18} />
            <p>No forwarded ports. Forwarded ports will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
