export type ConsoleLevel = "log" | "warn" | "error" | "info" | "debug";

export interface ConsoleEntry {
  level: ConsoleLevel;
  message: string;
  timestamp: number;
}

export interface OutputEntry {
  level: ConsoleLevel;
  message: string;
  timestamp: number;
  source?: string;
}

export type BottomPanelTab =
  | "problems"
  | "output"
  | "debugConsole"
  | "terminal"
  | "ports";

export interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

export interface WorkspaceState {
  rootPath: string | null;
  files: FileEntry[];
}

export interface OpenFile {
  path: string;
  name: string;
  content: string;
  language: string;
  dirty: boolean;
}

export const LANGUAGE_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  py: "python",
  go: "go",
  rs: "rust",
  json: "json",
  md: "markdown",
  css: "css",
  html: "html",
  sql: "sql",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  sh: "shell",
  bash: "shell",
};
