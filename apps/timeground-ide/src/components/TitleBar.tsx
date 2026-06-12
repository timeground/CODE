import "./TitleBar.css";

interface Props {
  projectName?: string | null;
}

const MENU_ITEMS = ["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"];

export function TitleBar({ projectName }: Props) {
  return (
    <header className="titlebar">
      <div className="titlebar-menus">
        {MENU_ITEMS.map((item) => (
          <button key={item} className="titlebar-menu-item" type="button">
            {item}
          </button>
        ))}
      </div>

      <div className="titlebar-drag-region" title="Drag to move window">
        <span className="titlebar-project">{projectName ?? "TimeGround Code"}</span>
      </div>
    </header>
  );
}
