import { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Check,
  Settings,
  Key,
  Brain,
  Code2,
  Table2,
} from "lucide-react";
import { COMPANY, RELEASE, TimeGroundLogo } from "@timeground/landing";
import { PROVIDERS, getModelsByPriceDesc, type ProviderId } from "@timeground/model-registry";
import "./SettingsPanel.css";

export type SettingsSection = "general" | "keys" | "ai" | "editor" | "models";

interface Props {
  onClose: () => void;
  onSettingsChange?: () => void;
}

const KEY_PROVIDERS: ProviderId[] = [
  "anthropic",
  "openai",
  "google",
  "deepseek",
  "xai",
  "mistral",
  "groq",
  "together",
  "openrouter",
  "minimax",
  "ollama",
];

const NAV_ITEMS: Array<{ id: SettingsSection; label: string; icon: React.ReactNode }> = [
  { id: "general", label: "General", icon: <Settings size={16} /> },
  { id: "keys", label: "API Keys", icon: <Key size={16} /> },
  { id: "ai", label: "AI Routing", icon: <Brain size={16} /> },
  { id: "editor", label: "Editor", icon: <Code2 size={16} /> },
  { id: "models", label: "Model Catalog", icon: <Table2 size={16} /> },
];

const QUALITY_OPTIONS = [
  { value: 0, label: "Fast", desc: "Cheapest models — great for quick questions and autocomplete" },
  { value: 1, label: "Balanced", desc: "Smart routing — quality and cost in balance (recommended)" },
  { value: 2, label: "Best", desc: "Maximum quality — frontier models for complex work" },
] as const;

export function SettingsPanel({ onClose, onSettingsChange }: Props) {
  const [section, setSection] = useState<SettingsSection>("general");
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [preferLocal, setPreferLocal] = useState(false);
  const [qualityMode, setQualityMode] = useState<0 | 1 | 2>(1);
  const [budgetCap, setBudgetCap] = useState("0");
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(4);
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(true);

  useEffect(() => {
    window.timeground.getSettings().then((s) => {
      const k: Record<string, string> = {};
      for (const p of KEY_PROVIDERS) {
        if (s[`apikey_${p}`]) k[p] = s[`apikey_${p}`];
      }
      setKeys(k);
      setPreferLocal(s.prefer_local === "true");
      const q = parseInt(s.quality_mode ?? "1", 10);
      setQualityMode((q === 0 || q === 2 ? q : 1) as 0 | 1 | 2);
      setBudgetCap(s.budget_cap ?? "0");
      setFontSize(parseInt(s.editor_font_size ?? "14", 10) || 14);
      setTabSize(parseInt(s.editor_tab_size ?? "4", 10) || 4);
      setWordWrap(s.editor_word_wrap === "on");
      setMinimap(s.editor_minimap !== "false");
    });
  }, []);

  const notifyChange = () => onSettingsChange?.();

  const saveSetting = async (key: string, value: string) => {
    await window.timeground.setSetting(key, value);
    notifyChange();
  };

  const saveKey = async (provider: ProviderId, value: string) => {
    if (value.trim()) {
      await window.timeground.setSetting(`apikey_${provider}`, value.trim());
    } else {
      await window.timeground.deleteSetting(`apikey_${provider}`);
    }
    setKeys((prev) => {
      const next = { ...prev };
      if (value.trim()) next[provider] = value.trim();
      else delete next[provider];
      return next;
    });
    setSaved(provider);
    setTimeout(() => setSaved(null), 2000);
    notifyChange();
  };

  const models = getModelsByPriceDesc();

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <header className="settings-header">
          <div className="settings-header-brand">
            <TimeGroundLogo size="sm" />
            <h2>Settings</h2>
          </div>
          <button className="settings-close" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </header>

        <div className="settings-body">
          <nav className="settings-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`settings-nav-item ${section === item.id ? "active" : ""}`}
                onClick={() => setSection(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="settings-content">
            {section === "general" && (
              <section className="settings-section">
                <h3>General</h3>
                <p className="settings-desc">
                  Workspace and privacy preferences for {COMPANY.product}.
                </p>

                <div className="settings-card">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={preferLocal}
                      onChange={async (e) => {
                        setPreferLocal(e.target.checked);
                        await saveSetting("prefer_local", String(e.target.checked));
                      }}
                    />
                    <span className="settings-toggle-track" />
                    <div>
                      <span className="settings-toggle-label">Prefer local models</span>
                      <span className="settings-toggle-hint">
                        Use Ollama when the task can be handled locally — private and free
                      </span>
                    </div>
                  </label>
                </div>

                <div className="settings-card settings-about">
                  <p>
                    {COMPANY.product} {RELEASE.label} — built by{" "}
                    <button
                      className="settings-link"
                      onClick={() => window.timeground.openExternal("https://timeground.in")}
                    >
                      TimeGround LLP
                    </button>
                  </p>
                  <p className="settings-muted">Build quietly. Let the work speak the loudest.</p>
                </div>
              </section>
            )}

            {section === "keys" && (
              <section className="settings-section">
                <h3>API Keys</h3>
                <p className="settings-desc">
                  Add keys for the providers you use. Ground routes each task to the best model you
                  have access to — keys are stored locally on your machine.
                </p>

                <div className="key-list">
                  {KEY_PROVIDERS.map((provider) => {
                    const info = PROVIDERS[provider];
                    return (
                      <div key={provider} className="key-row">
                        <div className="key-info">
                          <span className="key-provider">{info.name}</span>
                          <button
                            className="key-link"
                            onClick={() => window.timeground.openExternal(info.keyUrl)}
                          >
                            Get key <ExternalLink size={12} />
                          </button>
                        </div>
                        <div className="key-input-row">
                          <input
                            type="password"
                            className="key-input"
                            placeholder={
                              provider === "ollama"
                                ? "Optional — leave empty for local Ollama"
                                : `${info.name} API key`
                            }
                            value={keys[provider] ?? ""}
                            onChange={(e) =>
                              setKeys((prev) => ({ ...prev, [provider]: e.target.value }))
                            }
                            onBlur={(e) => saveKey(provider, e.target.value)}
                          />
                          {saved === provider && <Check size={16} className="key-saved" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {section === "ai" && (
              <section className="settings-section">
                <h3>AI Routing</h3>
                <p className="settings-desc">
                  Control how Ground picks models for chat and agent tasks.
                </p>

                <div className="settings-field">
                  <span className="settings-field-label">Default quality mode</span>
                  <div className="quality-cards">
                    {QUALITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`quality-card ${qualityMode === opt.value ? "active" : ""}`}
                        onClick={async () => {
                          setQualityMode(opt.value);
                          await saveSetting("quality_mode", String(opt.value));
                        }}
                      >
                        <span className="quality-card-label">{opt.label}</span>
                        <span className="quality-card-desc">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-field">
                  <label className="settings-field-label" htmlFor="budget-cap">
                    Monthly budget cap (USD)
                  </label>
                  <input
                    id="budget-cap"
                    type="number"
                    className="settings-input"
                    min={0}
                    step={1}
                    value={budgetCap}
                    onChange={(e) => setBudgetCap(e.target.value)}
                    onBlur={async (e) => {
                      const v = e.target.value || "0";
                      await saveSetting("budget_cap", v);
                    }}
                  />
                  <span className="settings-field-hint">0 = unlimited. Routing respects this cap when set.</span>
                </div>
              </section>
            )}

            {section === "editor" && (
              <section className="settings-section">
                <h3>Editor</h3>
                <p className="settings-desc">Monaco editor appearance and behavior.</p>

                <div className="settings-grid">
                  <div className="settings-field">
                    <label className="settings-field-label" htmlFor="font-size">Font size</label>
                    <input
                      id="font-size"
                      type="number"
                      className="settings-input"
                      min={10}
                      max={28}
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value, 10) || 14)}
                      onBlur={async (e) => {
                        const v = parseInt(e.target.value, 10) || 14;
                        setFontSize(v);
                        await saveSetting("editor_font_size", String(v));
                      }}
                    />
                  </div>

                  <div className="settings-field">
                    <label className="settings-field-label" htmlFor="tab-size">Tab size</label>
                    <select
                      id="tab-size"
                      className="settings-input"
                      value={tabSize}
                      onChange={async (e) => {
                        const v = parseInt(e.target.value, 10);
                        setTabSize(v);
                        await saveSetting("editor_tab_size", String(v));
                      }}
                    >
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                      <option value={8}>8 spaces</option>
                    </select>
                  </div>
                </div>

                <div className="settings-card">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={wordWrap}
                      onChange={async (e) => {
                        setWordWrap(e.target.checked);
                        await saveSetting("editor_word_wrap", e.target.checked ? "on" : "off");
                      }}
                    />
                    <span className="settings-toggle-track" />
                    <div>
                      <span className="settings-toggle-label">Word wrap</span>
                      <span className="settings-toggle-hint">Wrap long lines instead of horizontal scroll</span>
                    </div>
                  </label>
                </div>

                <div className="settings-card">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={minimap}
                      onChange={async (e) => {
                        setMinimap(e.target.checked);
                        await saveSetting("editor_minimap", String(e.target.checked));
                      }}
                    />
                    <span className="settings-toggle-track" />
                    <div>
                      <span className="settings-toggle-label">Minimap</span>
                      <span className="settings-toggle-hint">Show code overview on the right edge</span>
                    </div>
                  </label>
                </div>
              </section>
            )}

            {section === "models" && (
              <section className="settings-section">
                <h3>Model Catalog</h3>
                <p className="settings-desc">
                  {models.length} models ranked by price — from frontier to free and open-source.
                </p>

                <div className="model-catalog">
                  <table className="model-table">
                    <thead>
                      <tr>
                        <th>Model</th>
                        <th>Tier</th>
                        <th>Input/M</th>
                        <th>Output/M</th>
                        <th>Coding</th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((m) => (
                        <tr key={m.id}>
                          <td>
                            <span className="model-name">{m.name}</span>
                            <span className="model-provider">{PROVIDERS[m.provider].name}</span>
                          </td>
                          <td>
                            <span className={`tier-badge tier-${m.tier}`}>{m.tier}</span>
                          </td>
                          <td>${m.pricing.inputPer1M.toFixed(2)}</td>
                          <td>${m.pricing.outputPer1M.toFixed(2)}</td>
                          <td>{m.capabilities.coding}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
