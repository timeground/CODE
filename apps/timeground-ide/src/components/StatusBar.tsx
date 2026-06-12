import { GitBranch, Circle, Radio } from "lucide-react";
import type { OpenFile, BottomPanelTab } from "../types";
import "./StatusBar.css";

interface Props {
  activeFile: OpenFile | null;
  workspacePath: string | null;
  bottomPanelOpen: boolean;
  bottomPanelTab: BottomPanelTab;
  devToolsOpen: boolean;
  onOpenPanel: (tab: BottomPanelTab) => void;
  onToggleDevTools: () => void;
}

export function StatusBar({
  activeFile,
  workspacePath,
  bottomPanelOpen,
  bottomPanelTab,
  devToolsOpen,
  onOpenPanel,
  onToggleDevTools,
}: Props) {
  return (
    <footer className="statusbar">
      <div className="statusbar-left">
        <button
          className={`status-panel-btn ${bottomPanelOpen && bottomPanelTab === "terminal" ? "active" : ""}`}
          onClick={() => onOpenPanel("terminal")}
          title="Terminal"
        >
          Terminal
        </button>
        <span className="status-item">
          <GitBranch size={12} />
          main
        </span>
        {activeFile && (
          <span className="status-item">
            {activeFile.language.toUpperCase()}
            {activeFile.dirty && (
              <>
                <Circle size={6} className="dirty-dot" />
                Modified
              </>
            )}
          </span>
        )}
      </div>

      <div className="statusbar-right">
        <button
          className={`status-panel-btn ${devToolsOpen ? "active" : ""}`}
          onClick={onToggleDevTools}
          title="Developer Tools (F12)"
        >
          DevTools
        </button>
        {workspacePath && (
          <span className="status-item path">{workspacePath}</span>
        )}
        <span className="status-item">
          <Radio size={11} />
          TimeGround
        </span>
        <span className="status-item muted">Tab</span>
      </div>
    </footer>
  );
}
