import { Search } from "lucide-react";
import "./SearchPanel.css";

export function SearchPanel({ width }: { width: number }) {
  return (
    <aside className="search-panel" style={{ width }}>
      <div className="search-panel-header">
        <span>SEARCH</span>
      </div>
      <div className="search-panel-body">
        <div className="search-input-wrap">
          <Search size={14} />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <p className="search-hint">Search across files in your workspace.</p>
      </div>
    </aside>
  );
}
