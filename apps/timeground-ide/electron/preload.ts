import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

interface ConsoleEntry {
  level: "log" | "warn" | "error" | "info" | "debug";
  message: string;
  timestamp: number;
}

interface OutputEntry {
  level: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: number;
  source?: string;
}

const consoleLevels = ["log", "warn", "error", "info", "debug"] as const;

function formatConsoleArg(arg: unknown): string {
  if (typeof arg === "string") return arg;
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

consoleLevels.forEach((level) => {
  const original = console[level].bind(console);
  console[level] = (...args: unknown[]) => {
    ipcRenderer.send("console:log", {
      level,
      message: args.map(formatConsoleArg).join(" "),
      timestamp: Date.now(),
    });
    original(...args);
  };
});

function subscribe<T>(
  channel: string,
  callback: (payload: T) => void
): () => void {
  const handler = (_e: IpcRendererEvent, payload: T) => callback(payload);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

contextBridge.exposeInMainWorld("timeground", {
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  readDir: (path: string) => ipcRenderer.invoke("fs:readDir", path),
  readFile: (path: string) => ipcRenderer.invoke("fs:readFile", path),
  writeFile: (path: string, content: string) =>
    ipcRenderer.invoke("fs:writeFile", path, content),
  openExternal: (url: string) => ipcRenderer.invoke("shell:openExternal", url),
  getSettings: () => ipcRenderer.invoke("settings:get"),
  setSetting: (key: string, value: string) =>
    ipcRenderer.invoke("settings:set", key, value),
  deleteSetting: (key: string) => ipcRenderer.invoke("settings:delete", key),
  toggleDevTools: () => ipcRenderer.invoke("devtools:toggle") as Promise<boolean>,
  openDevTools: () => ipcRenderer.invoke("devtools:open") as Promise<boolean>,
  closeDevTools: () => ipcRenderer.invoke("devtools:close"),
  isDevToolsOpen: () => ipcRenderer.invoke("devtools:isOpen") as Promise<boolean>,
  onConsoleMessage: (callback: (entry: ConsoleEntry) => void) =>
    subscribe("console:message", callback),
  onOutputMessage: (callback: (entry: OutputEntry) => void) =>
    subscribe("output:message", callback),
  onDevToolsStateChange: (callback: (open: boolean) => void) =>
    subscribe("devtools:state", callback),
});

export interface TimeGroundAPI {
  openFolder: () => Promise<string | null>;
  openFile: () => Promise<string | null>;
  readDir: (path: string) => Promise<Array<{ name: string; path: string; isDirectory: boolean }>>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<boolean>;
  openExternal: (url: string) => Promise<void>;
  getSettings: () => Promise<Record<string, string>>;
  setSetting: (key: string, value: string) => Promise<boolean>;
  deleteSetting: (key: string) => Promise<boolean>;
  toggleDevTools: () => Promise<boolean>;
  openDevTools: () => Promise<boolean>;
  closeDevTools: () => Promise<void>;
  isDevToolsOpen: () => Promise<boolean>;
  onConsoleMessage: (callback: (entry: ConsoleEntry) => void) => () => void;
  onOutputMessage: (callback: (entry: OutputEntry) => void) => () => void;
  onDevToolsStateChange: (callback: (open: boolean) => void) => () => void;
}

declare global {
  interface Window {
    timeground: TimeGroundAPI;
  }
}
