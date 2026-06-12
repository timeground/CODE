export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
}

export interface AppSettings {
  editor: EditorSettings;
  qualityMode: 0 | 1 | 2;
}

export function parseAppSettings(raw: Record<string, string>): AppSettings {
  const q = parseInt(raw.quality_mode ?? "1", 10);
  const qualityMode = (q === 0 || q === 2 ? q : 1) as 0 | 1 | 2;

  return {
    qualityMode,
    editor: {
      fontSize: parseInt(raw.editor_font_size ?? "14", 10) || 14,
      tabSize: parseInt(raw.editor_tab_size ?? "4", 10) || 4,
      wordWrap: raw.editor_word_wrap === "on",
      minimap: raw.editor_minimap !== "false",
    },
  };
}

export async function loadAppSettings(): Promise<AppSettings> {
  const raw = await window.timeground.getSettings();
  return parseAppSettings(raw);
}
