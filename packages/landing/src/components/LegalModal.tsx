import { createPortal } from "react-dom";
import { X, ExternalLink } from "lucide-react";
import { LEGAL_DOCS, type LegalDoc } from "../content/legal";
import { LINKS } from "../content/company";
import type { LandingActions } from "../types";

interface Props {
  doc: LegalDoc;
  onClose: () => void;
  actions: LandingActions;
}

export function LegalModal({ doc, onClose, actions }: Props) {
  const content = LEGAL_DOCS[doc];
  const externalUrl =
    doc === "privacy" ? LINKS.privacy : doc === "terms" ? LINKS.terms : LINKS.security;

  return createPortal(
    <div className="tg-legal-overlay" onClick={onClose}>
      <div className="tg-legal-modal" onClick={(e) => e.stopPropagation()}>
        <header className="tg-legal-header">
          <div>
            <h2>{content.title}</h2>
            <p className="tg-legal-updated">Last updated: {content.updated}</p>
          </div>
          <button type="button" className="tg-legal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="tg-legal-body">
          {content.sections.map((section) => (
            <section key={section.heading} className="tg-legal-section">
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <footer className="tg-legal-footer">
          <button
            type="button"
            className="tg-legal-external"
            onClick={() => actions.openExternal(externalUrl)}
          >
            View on timeground.in <ExternalLink size={14} />
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
