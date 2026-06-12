import "../styles/landing.css";
import { useState, useMemo } from "react";
import {
  Download,
  FolderOpen,
  Key,
  Brain,
  Shield,
  Zap,
  Globe,
  Mail,
  ExternalLink,
  PlayCircle,
  ArrowRight,
  Monitor,
  Apple,
  Terminal,
  Check,
  ChevronRight,
} from "lucide-react";
import {
  COMPANY,
  CONTACT_CHANNELS,
  DOWNLOADS,
  EMAILS,
  LINKS,
  RELEASE,
  SITE_NAV,
} from "../content/company";
import type { LegalDoc } from "../content/legal";
import type { LandingSiteProps } from "../types";
import { detectPlatform } from "../types";
import { LegalModal } from "./LegalModal";
import { TimeGroundLogo } from "./TimeGroundLogo";

const FEATURES = [
  {
    icon: Brain,
    title: "Intelligent routing",
    desc: "Ground analyzes each task and picks the right model — cheap for quick asks, frontier when quality counts.",
  },
  {
    icon: Shield,
    title: "Local-first privacy",
    desc: "API keys stay on your device. Run Ollama locally for code that never leaves your machine.",
  },
  {
    icon: Globe,
    title: "30+ AI models",
    desc: "Claude, GPT, Gemini, DeepSeek, Groq, OpenRouter, and open-weight locals in one editor.",
  },
  {
    icon: Zap,
    title: "Built for builders",
    desc: "Monaco editor, agent panel, terminal, and a routing engine designed for daily shipping.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Download & open",
    desc: `Install ${COMPANY.product} for your platform. No account required to start coding.`,
  },
  {
    step: "02",
    title: "Add your keys",
    desc: "Connect the AI providers you trust — or use local models only.",
  },
  {
    step: "03",
    title: "Ship with Ground",
    desc: "Chat, edit, and let routing handle model selection automatically.",
  },
];

const IDE_SHORTCUTS = [
  { keys: ["Ctrl", "Shift", "L"], label: "New agent" },
  { keys: ["Ctrl", "P"], label: "Search files" },
  { keys: ["Ctrl", "`"], label: "Terminal" },
  { keys: ["Ctrl", "L"], label: "Toggle agent" },
];

const PLATFORM_ICONS = {
  windows: Monitor,
  mac: Apple,
  linux: Terminal,
} as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function LandingSite({
  mode,
  actions,
  onOpenFolder,
  onOpenSettings,
}: LandingSiteProps) {
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const platform = useMemo(() => detectPlatform(), []);

  const openMail = (email: string, subject?: string) => {
    const q = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    actions.openExternal(`mailto:${email}${q}`);
  };

  const download = (url: string) => {
    actions.openExternal(url);
  };

  const downloadCards = [
    { key: "windows" as const, ...DOWNLOADS.windows },
    { key: "mac" as const, ...DOWNLOADS.mac },
    { key: "linux" as const, ...DOWNLOADS.linux },
  ];

  return (
    <div className={`tg-site tg-site--${mode}`}>
      <div className="tg-site-bg" aria-hidden="true">
        <div className="tg-orb tg-orb-a" />
        <div className="tg-orb tg-orb-b" />
        <div className="tg-grid" />
      </div>

      {mode === "web" && (
        <header className="tg-nav">
          <button type="button" className="tg-nav-brand" onClick={() => scrollTo("top")}>
            <TimeGroundLogo size="sm" />
          </button>
          <nav className="tg-nav-links">
            {SITE_NAV.map((item) => (
              <button type="button" key={item.id} onClick={() => scrollTo(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="tg-nav-actions">
            <button type="button" className="tg-btn tg-btn-ghost tg-btn-sm" onClick={() => scrollTo("download")}>
              Download
            </button>
            <button
              type="button"
              className="tg-btn tg-btn-primary tg-btn-sm"
              onClick={() => download(DOWNLOADS[platform === "unknown" ? "windows" : platform].url)}
            >
              <Download size={16} />
              Get TimeGround Code
            </button>
          </div>
        </header>
      )}

      <div className="tg-site-scroll" id="top">
        <section className="tg-hero">
          <div className="tg-hero-brand">
            <TimeGroundLogo size="hero" />
          </div>

          <h1 className="tg-hero-title">
            Code with clarity.
            <span className="tg-hero-accent">AI that knows when to think big.</span>
          </h1>

          <p className="tg-hero-desc">{COMPANY.description}</p>
          <p className="tg-hero-quote">{COMPANY.tagline}</p>

          <div className="tg-hero-actions">
            {mode === "ide" ? (
              <>
                <button type="button" className="tg-btn tg-btn-primary" onClick={onOpenFolder}>
                  <FolderOpen size={18} />
                  Open project
                </button>
                <button type="button" className="tg-btn tg-btn-secondary" onClick={onOpenSettings}>
                  <Key size={18} />
                  API keys
                </button>
                <button type="button" className="tg-btn tg-btn-ghost" onClick={() => scrollTo("download")}>
                  <Download size={18} />
                  Download for another device
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="tg-btn tg-btn-primary"
                  onClick={() =>
                    download(DOWNLOADS[platform === "unknown" ? "windows" : platform].url)
                  }
                >
                  <Download size={18} />
                  Download for {platform === "unknown" ? "Windows" : DOWNLOADS[platform].label}
                </button>
                <button type="button" className="tg-btn tg-btn-text" onClick={() => scrollTo("download")}>
                  All platforms
                </button>
                <button
                  type="button"
                  className="tg-btn tg-btn-text"
                  onClick={() => openMail(EMAILS.demo, "TimeGround Code demo")}
                >
                  <PlayCircle size={18} />
                  Request demo
                </button>
              </>
            )}
          </div>

          {mode === "ide" && (
            <p className="tg-hero-running">
              <Check size={14} />
              You&apos;re running {COMPANY.product} {RELEASE.label}
            </p>
          )}
        </section>

        <section id="features" className="tg-section">
          <div className="tg-section-head">
            <h2>Why {COMPANY.product}</h2>
            <p>Everything you need from a modern editor — with routing that respects your time and budget.</p>
          </div>
          <div className="tg-features">
            {FEATURES.map((f) => (
              <article key={f.title} className="tg-feature-card">
                <div className="tg-feature-icon">
                  <f.icon size={22} strokeWidth={1.5} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="tg-section">
          <div className="tg-section-head">
            <h2>How it works</h2>
            <p>From install to first commit in minutes.</p>
          </div>
          <div className="tg-steps">
            {STEPS.map((s) => (
              <article key={s.step} className="tg-step-card">
                <span className="tg-step-num">{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="download" className="tg-section tg-download-section">
          <div className="tg-section-head">
            <h2>Download {COMPANY.product}</h2>
            <p>
              Free desktop editor · {RELEASE.label} · {RELEASE.date}
            </p>
            <span className="tg-download-req">{RELEASE.requirements}</span>
          </div>

          <div className="tg-download-grid">
            {downloadCards.map((card) => {
              const Icon = PLATFORM_ICONS[card.key];
              const isRecommended = platform === card.key;
              return (
                <article
                  key={card.key}
                  className={`tg-download-card ${isRecommended ? "recommended" : ""}`}
                >
                  {isRecommended && <span className="tg-download-badge">Recommended for you</span>}
                  <div className="tg-download-card-icon">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3>{card.label}</h3>
                  <p className="tg-download-sublabel">{card.sublabel}</p>
                  <p className="tg-download-file">{card.file}</p>
                  <button type="button" className="tg-btn tg-btn-download tg-btn-block" onClick={() => download(card.url)}>
                    <Download size={16} />
                    Download
                  </button>
                </article>
              );
            })}
          </div>

          <p className="tg-download-note">
            Installers are hosted at{" "}
            <button type="button" className="tg-link" onClick={() => actions.openExternal(LINKS.download)}>
              timeground.in/download
            </button>
            . Need help?{" "}
            <button type="button" className="tg-link" onClick={() => openMail(EMAILS.support)}>
              {EMAILS.support}
            </button>
          </p>
        </section>

        {mode === "ide" && (
          <section className="tg-section tg-ide-panel">
            <div className="tg-section-head">
              <h2>Start in this window</h2>
              <p>Open a folder or explore keyboard shortcuts.</p>
            </div>
            <div className="tg-ide-panel-grid">
              <button type="button" className="tg-ide-quick" onClick={onOpenFolder}>
                <FolderOpen size={20} />
                <span>Open folder</span>
                <ChevronRight size={16} />
              </button>
              <button type="button" className="tg-ide-quick" onClick={onOpenSettings}>
                <Key size={20} />
                <span>Configure API keys</span>
                <ChevronRight size={16} />
              </button>
              <div className="tg-shortcuts-card">
                <h3>Shortcuts</h3>
                <ul>
                  {IDE_SHORTCUTS.map((s) => (
                    <li key={s.label}>
                      <div className="tg-shortcut-keys">
                        {s.keys.map((k) => <kbd key={k}>{k}</kbd>)}
                      </div>
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="tg-section">
          <div className="tg-section-head">
            <h2>Contact {COMPANY.name}</h2>
            <p>We read every message. Choose the channel that fits.</p>
          </div>
          <div className="tg-contact-grid">
            {CONTACT_CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className="tg-contact-card"
                onClick={() =>
                  openMail(ch.email, ch.id === "demo" ? "TimeGround Code demo" : undefined)
                }
              >
                <div className="tg-contact-body">
                  <span className="tg-contact-label">{ch.label}</span>
                  <span className="tg-contact-desc">{ch.description}</span>
                  <span className="tg-contact-email">{ch.email}</span>
                </div>
                <ArrowRight size={16} className="tg-contact-arrow" aria-hidden />
              </button>
            ))}
          </div>
          <p className="tg-contact-fallback">
            General contact:{" "}
            <button type="button" className="tg-link" onClick={() => openMail(EMAILS.contact)}>
              {EMAILS.contact}
            </button>
          </p>
        </section>

        <footer className="tg-footer">
          <div className="tg-footer-brand">
            <TimeGroundLogo size="sm" />
          </div>
          <nav className="tg-footer-links">
            <button type="button" onClick={() => setLegalDoc("privacy")}>Privacy</button>
            <button type="button" onClick={() => setLegalDoc("terms")}>Terms</button>
            <button type="button" onClick={() => setLegalDoc("security")}>Security</button>
            <button type="button" onClick={() => actions.openExternal(LINKS.home)}>
              timeground.in <ExternalLink size={12} />
            </button>
          </nav>
          <div className="tg-footer-meta">
            <span>© {COMPANY.foundedYear} {COMPANY.name}</span>
            <button type="button" className="tg-footer-mail" onClick={() => openMail(EMAILS.support)}>
              <Mail size={12} />
              {EMAILS.support}
            </button>
          </div>
        </footer>
      </div>

      {legalDoc && (
        <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} actions={actions} />
      )}
    </div>
  );
}
