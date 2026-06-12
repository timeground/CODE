import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import path from "path";
import fs from "fs/promises";

let mainWindow: BrowserWindow | null = null;

function sendOutput(message: string, level = "info") {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("output:message", {
      level,
      message,
      timestamp: Date.now(),
      source: "TimeGround Code",
    });
  }
}

function bindDevToolsEvents(win: BrowserWindow) {
  win.webContents.on("devtools-opened", () => {
    win.webContents.send("devtools:state", true);
  });
  win.webContents.on("devtools-closed", () => {
    win.webContents.send("devtools:state", false);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    title: "TimeGround Code",
    backgroundColor: "#181818",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#181818",
      symbolColor: "#cccccc",
      height: 35,
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  bindDevToolsEvents(mainWindow);

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    sendOutput("Development server connected", "info");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    sendOutput("Production build loaded", "info");
  }

  mainWindow.webContents.on("did-finish-load", () => {
    sendOutput("Application ready", "info");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ─── File System IPC ───────────────────────────────────────────────────────

ipcMain.handle("dialog:openFolder", async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openDirectory"],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("dialog:openFile", async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openFile"],
    filters: [
      { name: "All Files", extensions: ["*"] },
      { name: "Code", extensions: ["ts", "tsx", "js", "jsx", "py", "go", "rs", "json", "md", "css", "html"] },
    ],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("fs:readDir", async (_e, dirPath: string) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((e) => !e.name.startsWith(".") && e.name !== "node_modules")
    .map((e) => ({
      name: e.name,
      path: path.join(dirPath, e.name),
      isDirectory: e.isDirectory(),
    }))
    .sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
});

ipcMain.handle("fs:readFile", async (_e, filePath: string) => {
  return fs.readFile(filePath, "utf-8");
});

ipcMain.handle("fs:writeFile", async (_e, filePath: string, content: string) => {
  await fs.writeFile(filePath, content, "utf-8");
  return true;
});

ipcMain.handle("shell:openExternal", async (_e, url: string) => {
  await shell.openExternal(url);
});

// ─── Settings / API Keys (stored locally) ──────────────────────────────────

const settingsPath = path.join(app.getPath("userData"), "timeground-settings.json");

async function loadSettings(): Promise<Record<string, string>> {
  try {
    const data = await fs.readFile(settingsPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveSettings(settings: Record<string, string>) {
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
}

ipcMain.handle("settings:get", async () => loadSettings());

ipcMain.handle("settings:set", async (_e, key: string, value: string) => {
  const settings = await loadSettings();
  settings[key] = value;
  await saveSettings(settings);
  return true;
});

ipcMain.handle("settings:delete", async (_e, key: string) => {
  const settings = await loadSettings();
  delete settings[key];
  await saveSettings(settings);
  return true;
});

// ─── DevTools (docked in main window — Cursor / VS Code style) ─────────────

ipcMain.handle("devtools:toggle", () => {
  const win = mainWindow;
  if (!win) return false;

  if (win.webContents.isDevToolsOpened()) {
    win.webContents.closeDevTools();
    return false;
  }

  win.webContents.openDevTools({ mode: "bottom", activate: true });
  return true;
});

ipcMain.handle("devtools:open", () => {
  const win = mainWindow;
  if (!win) return false;

  if (!win.webContents.isDevToolsOpened()) {
    win.webContents.openDevTools({ mode: "bottom", activate: true });
  }
  return true;
});

ipcMain.handle("devtools:close", () => {
  if (mainWindow?.webContents.isDevToolsOpened()) {
    mainWindow.webContents.closeDevTools();
  }
});

ipcMain.handle("devtools:isOpen", () => {
  return mainWindow?.webContents.isDevToolsOpened() ?? false;
});

ipcMain.on("console:log", (_e, entry: { level: string; message: string; timestamp: number }) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("console:message", entry);
  }
});
