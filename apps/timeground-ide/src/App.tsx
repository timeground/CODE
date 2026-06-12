import { useState, useCallback, useEffect, useRef } from "react";
import { TitleBar } from "./components/TitleBar";
import { ActivityBar, type ActivityView } from "./components/ActivityBar";
import { Sidebar } from "./components/Sidebar";
import { SearchPanel } from "./components/SearchPanel";
import { EditorPanel } from "./components/EditorPanel";
import { ChatPanel } from "./components/ChatPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { loadAppSettings, type AppSettings } from "./settings";
import { HomePage } from "./components/HomePage";
import { StatusBar } from "./components/StatusBar";
import { BottomPanel } from "./components/BottomPanel";
import type { BottomPanelTab, OpenFile, WorkspaceState } from "./types";
import "./styles/app.css";

const DEFAULT_PANEL_HEIGHT = 260;
const SIDEBAR_WIDTH = 260;

export default function App() {
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [workspace, setWorkspace] = useState<WorkspaceState>({
    rootPath: null,
    files: [],
  });
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activityView, setActivityView] = useState<ActivityView>("explorer");
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [chatWidth] = useState(380);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [bottomPanelTab, setBottomPanelTab] = useState<BottomPanelTab>("terminal");
  const [bottomPanelHeight, setBottomPanelHeight] = useState(DEFAULT_PANEL_HEIGHT);
  const [panelMaxHeight, setPanelMaxHeight] = useState(480);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const refreshSettings = useCallback(async () => {
    setAppSettings(await loadAppSettings());
  }, []);

  useEffect(() => {
    refreshSettings();
    window.timeground.isDevToolsOpen().then(setDevToolsOpen);
    return window.timeground.onDevToolsStateChange(setDevToolsOpen);
  }, [refreshSettings]);

  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;

    const updateMax = () => {
      setPanelMaxHeight(Math.max(200, Math.floor(el.clientHeight * 0.65)));
    };

    updateMax();
    const observer = new ResizeObserver(updateMax);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const openPanel = useCallback((tab: BottomPanelTab) => {
    if (devToolsOpen) {
      window.timeground.closeDevTools();
    }
    setBottomPanelTab(tab);
    setBottomPanelOpen(true);
  }, [devToolsOpen]);

  const closePanel = useCallback(() => {
    setBottomPanelOpen(false);
  }, []);

  const toggleBottomPanel = useCallback((tab?: BottomPanelTab) => {
    if (tab) {
      if (bottomPanelOpen && bottomPanelTab === tab) {
        closePanel();
      } else {
        openPanel(tab);
      }
      return;
    }
    setBottomPanelOpen((open) => !open);
  }, [bottomPanelOpen, bottomPanelTab, closePanel, openPanel]);

  const toggleDevTools = useCallback(async () => {
    if (devToolsOpen) {
      await window.timeground.closeDevTools();
      return;
    }
    if (bottomPanelOpen) {
      setBottomPanelOpen(false);
    }
    await window.timeground.openDevTools();
  }, [devToolsOpen, bottomPanelOpen]);

  const activeFile = openFiles[activeFileIndex] ?? null;
  const projectName = workspace.rootPath?.split(/[/\\]/).pop() ?? null;
  const showEditor = openFiles.length > 0;

  const openFolder = useCallback(async () => {
    const path = await window.timeground.openFolder();
    if (!path) return;

    const entries = await window.timeground.readDir(path);
    setWorkspace({ rootPath: path, files: entries });
    setActivityView("explorer");
  }, []);

  const openFileByPath = useCallback(async (filePath: string) => {
    const existing = openFiles.findIndex((f) => f.path === filePath);
    if (existing >= 0) {
      setActiveFileIndex(existing);
      return;
    }

    const content = await window.timeground.readFile(filePath);
    const name = filePath.split(/[/\\]/).pop() ?? filePath;
    const ext = name.split(".").pop()?.toLowerCase() ?? "";

    setOpenFiles((prev) => [...prev, { path: filePath, name, content, language: ext, dirty: false }]);
    setActiveFileIndex(openFiles.length);
  }, [openFiles]);

  const updateFileContent = useCallback((content: string) => {
    setOpenFiles((prev) =>
      prev.map((f, i) =>
        i === activeFileIndex ? { ...f, content, dirty: true } : f
      )
    );
  }, [activeFileIndex]);

  const saveActiveFile = useCallback(async () => {
    if (!activeFile) return;
    await window.timeground.writeFile(activeFile.path, activeFile.content);
    setOpenFiles((prev) =>
      prev.map((f, i) => (i === activeFileIndex ? { ...f, dirty: false } : f))
    );
  }, [activeFile, activeFileIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveActiveFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        e.preventDefault();
        setChatOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setSettingsOpen(true);
      }
      if (e.key === "F12") {
        e.preventDefault();
        toggleDevTools();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        toggleBottomPanel("debugConsole");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        toggleBottomPanel("terminal");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        toggleBottomPanel();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setActivityView("explorer");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveActiveFile, toggleBottomPanel, toggleDevTools]);

  useEffect(() => {
    return () => {
      window.timeground.closeDevTools();
    };
  }, []);

  const showSidebar =
    activityView === "explorer" || activityView === "search";

  return (
    <div className="app">
      <TitleBar projectName={projectName} />

      <div className="workbench">
        <ActivityBar
          activeView={activityView}
          chatOpen={chatOpen}
          onViewChange={setActivityView}
          onToggleChat={() => setChatOpen((v) => !v)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <div className="workspace" ref={workspaceRef}>
          {showSidebar && activityView === "explorer" && (
            <Sidebar
              width={SIDEBAR_WIDTH}
              workspace={workspace}
              onOpenFile={openFileByPath}
              onOpenFolder={openFolder}
            />
          )}
          {showSidebar && activityView === "search" && (
            <SearchPanel width={SIDEBAR_WIDTH} />
          )}

          <div className="center-column">
            <div className="app-body">
              <main className="main-area">
                {showEditor ? (
                  <EditorPanel
                    openFiles={openFiles}
                    activeIndex={activeFileIndex}
                    onSelectTab={setActiveFileIndex}
                    onCloseTab={(i) => {
                      setOpenFiles((prev) => prev.filter((_, idx) => idx !== i));
                      setActiveFileIndex(Math.max(0, i - 1));
                    }}
                    onChange={updateFileContent}
                    activeFile={activeFile}
                    editorSettings={appSettings?.editor}
                  />
                ) : (
                  <HomePage
                    onOpenFolder={openFolder}
                    onOpenSettings={() => setSettingsOpen(true)}
                  />
                )}
              </main>

              {chatOpen && (
                <ChatPanel
                  width={chatWidth}
                  openFileCount={openFiles.length}
                  hasOpenFiles={openFiles.length > 0}
                  qualityMode={appSettings?.qualityMode ?? 1}
                  onQualityModeChange={refreshSettings}
                />
              )}
            </div>

            <BottomPanel
              open={bottomPanelOpen && !devToolsOpen}
              tab={bottomPanelTab}
              height={bottomPanelHeight}
              maxHeight={panelMaxHeight}
              onClose={closePanel}
              onTabChange={openPanel}
              onHeightChange={setBottomPanelHeight}
            />
          </div>
        </div>
      </div>

      <StatusBar
        activeFile={activeFile}
        workspacePath={workspace.rootPath}
        bottomPanelOpen={bottomPanelOpen && !devToolsOpen}
        bottomPanelTab={bottomPanelTab}
        devToolsOpen={devToolsOpen}
        onOpenPanel={openPanel}
        onToggleDevTools={toggleDevTools}
      />

      {settingsOpen && (
        <SettingsPanel
          onClose={() => setSettingsOpen(false)}
          onSettingsChange={refreshSettings}
        />
      )}
    </div>
  );
}
