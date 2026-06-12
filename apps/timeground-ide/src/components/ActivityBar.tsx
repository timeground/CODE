import { Files, MessageSquare, Settings, Search } from "lucide-react";
import "./ActivityBar.css";

export type ActivityView = "explorer" | "search" | "chat" | "settings";

interface Props {
  activeView: ActivityView;
  chatOpen: boolean;
  onViewChange: (view: ActivityView) => void;
  onToggleChat: () => void;
  onOpenSettings: () => void;
}

export function ActivityBar({
  activeView,
  chatOpen,
  onViewChange,
  onToggleChat,
  onOpenSettings,
}: Props) {
  return (
    <nav className="activity-bar" aria-label="Activity Bar">
      <button
        className={`activity-item ${activeView === "explorer" ? "active" : ""}`}
        onClick={() => onViewChange("explorer")}
        title="Explorer (Ctrl+Shift+E)"
      >
        <Files size={22} strokeWidth={1.5} />
      </button>
      <button
        className={`activity-item ${activeView === "search" ? "active" : ""}`}
        onClick={() => onViewChange("search")}
        title="Search"
      >
        <Search size={22} strokeWidth={1.5} />
      </button>
      <button
        className={`activity-item ${chatOpen ? "active" : ""}`}
        onClick={onToggleChat}
        title="Agent (Ctrl+L)"
      >
        <MessageSquare size={22} strokeWidth={1.5} />
      </button>

      <div className="activity-spacer" />

      <button
        className="activity-item"
        onClick={onOpenSettings}
        title="Settings (Ctrl+,)"
      >
        <Settings size={22} strokeWidth={1.5} />
      </button>
    </nav>
  );
}
