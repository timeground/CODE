import { useState } from "react";
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  ChevronsDownUp,
} from "lucide-react";
import type { WorkspaceState } from "../types";
import "./Sidebar.css";

interface Props {
  width: number;
  workspace: WorkspaceState;
  onOpenFile: (path: string) => void;
  onOpenFolder: () => void;
}

export function Sidebar({ width, workspace, onOpenFile, onOpenFolder }: Props) {
  const hasProject = Boolean(workspace.rootPath);
  const folderName = workspace.rootPath?.split(/[/\\]/).pop() ?? "No Folder Opened";

  return (
    <aside className="sidebar" style={{ width }}>
      <div className="sidebar-header">
        <span className="sidebar-title">EXPLORER</span>
        <div className="sidebar-header-actions">
          <button className="sidebar-action" onClick={onOpenFolder} title="Open Folder">
            <FolderOpen size={14} />
          </button>
          <button className="sidebar-action" title="Collapse All">
            <ChevronsDownUp size={14} />
          </button>
        </div>
      </div>

      {hasProject ? (
        <>
          <div className="sidebar-project">
            <ChevronDown size={14} />
            <span>{folderName}</span>
          </div>
          <div className="sidebar-files">
            {workspace.files.map((entry) =>
              entry.isDirectory ? (
                <FolderItem
                  key={entry.path}
                  path={entry.path}
                  name={entry.name}
                  onOpenFile={onOpenFile}
                  depth={1}
                />
              ) : (
                <FileItem
                  key={entry.path}
                  path={entry.path}
                  name={entry.name}
                  onOpenFile={onOpenFile}
                  depth={1}
                />
              )
            )}
          </div>
        </>
      ) : (
        <div className="sidebar-empty">
          <p>You have not yet opened a folder.</p>
          <button className="sidebar-open-btn" onClick={onOpenFolder}>
            Open Folder
          </button>
        </div>
      )}

      <div className="sidebar-section collapsed">
        <button className="sidebar-section-header">
          <ChevronRight size={14} />
          <span>OUTLINE</span>
        </button>
      </div>
      <div className="sidebar-section collapsed">
        <button className="sidebar-section-header">
          <ChevronRight size={14} />
          <span>TIMELINE</span>
        </button>
      </div>
    </aside>
  );
}

function FolderItem({
  path,
  name,
  onOpenFile,
  depth,
}: {
  path: string;
  name: string;
  onOpenFile: (p: string) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<
    Array<{ name: string; path: string; isDirectory: boolean }>
  >([]);

  const toggle = async () => {
    if (!expanded) {
      const entries = await window.timeground.readDir(path);
      setChildren(entries);
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <button className="tree-item" style={{ paddingLeft: depth * 12 + 8 }} onClick={toggle}>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Folder size={14} className="icon-folder" />
        <span>{name}</span>
      </button>
      {expanded &&
        children.map((c) =>
          c.isDirectory ? (
            <FolderItem
              key={c.path}
              path={c.path}
              name={c.name}
              onOpenFile={onOpenFile}
              depth={depth + 1}
            />
          ) : (
            <FileItem
              key={c.path}
              path={c.path}
              name={c.name}
              onOpenFile={onOpenFile}
              depth={depth + 1}
            />
          )
        )}
    </>
  );
}

function FileItem({
  path,
  name,
  onOpenFile,
  depth,
}: {
  path: string;
  name: string;
  onOpenFile: (p: string) => void;
  depth: number;
}) {
  return (
    <button
      className="tree-item"
      style={{ paddingLeft: depth * 12 + 24 }}
      onClick={() => onOpenFile(path)}
    >
      <File size={14} className="icon-file" />
      <span>{name}</span>
    </button>
  );
}
