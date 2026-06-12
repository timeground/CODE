import { COMPANY, EMAILS, LINKS } from "./company";

export type LegalDoc = "privacy" | "terms" | "security";

export const LEGAL_DOCS: Record<
  LegalDoc,
  { title: string; updated: string; sections: Array<{ heading: string; body: string }> }
> = {
  privacy: {
    title: "Privacy Policy",
    updated: "June 2026",
    sections: [
      {
        heading: "Overview",
        body: `${COMPANY.product} is built by ${COMPANY.name}. We respect your privacy and design our products so your code and keys stay on your machine whenever possible.`,
      },
      {
        heading: "Data we collect",
        body: `The IDE stores project files locally on your device. API keys you enter are saved in your user data directory and are not transmitted to ${COMPANY.name} servers. When you use AI features, prompts and code context are sent only to the model providers you configure (OpenAI, Anthropic, Google, etc.) according to their policies.`,
      },
      {
        heading: "Data we do not collect",
        body: "We do not require an account to use the desktop IDE. We do not sell your source code, prompts, or API keys. We do not run a cloud copy of your workspace unless you explicitly connect a remote service.",
      },
      {
        heading: "Local storage",
        body: "Settings, API keys, and preferences are stored locally via the Electron userData path on your computer. You can remove this data by deleting the application data folder or uninstalling the IDE.",
      },
      {
        heading: "Third-party AI providers",
        body: "When Ground routes a task to an external model, that provider processes your request under their terms. Review each provider's privacy policy before adding API keys. Prefer local models (Ollama) when you need full on-device privacy.",
      },
      {
        heading: "Updates & contact",
        body: `We may update this policy as the product evolves. Questions: ${EMAILS.hello}. Security concerns: ${EMAILS.support}. Full policy may also be published at ${LINKS.privacy}.`,
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "June 2026",
    sections: [
      {
        heading: "Agreement",
        body: `By installing or using ${COMPANY.product}, you agree to these terms with ${COMPANY.name}. If you do not agree, do not use the software.`,
      },
      {
        heading: "License",
        body: `${COMPANY.product} is provided under the MIT License for the open-source components of the project. Brand assets, routing catalog data, and proprietary integrations remain the property of ${COMPANY.name}.`,
      },
      {
        heading: "Your responsibilities",
        body: "You are responsible for your code, API keys, and compliance with third-party provider terms. Do not use the IDE for unlawful activity. You must have rights to any code you open or submit to AI models.",
      },
      {
        heading: "AI outputs",
        body: "AI-generated suggestions may be inaccurate or incomplete. You are responsible for reviewing, testing, and securing all code before production use. ${COMPANY.name} does not guarantee model availability, accuracy, or cost.",
      },
      {
        heading: "Disclaimer",
        body: `THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. ${COMPANY.name} is not liable for indirect, incidental, or consequential damages arising from use of the IDE or connected AI services.`,
      },
      {
        heading: "Contact",
        body: `Legal and licensing: ${EMAILS.contact}. Sales: ${EMAILS.sales}. Support: ${EMAILS.support}.`,
      },
    ],
  },
  security: {
    title: "Security",
    updated: "June 2026",
    sections: [
      {
        heading: "Local-first design",
        body: `${COMPANY.product} runs as a desktop application. Your workspace files remain on disk under your control. API keys are stored locally and encrypted at rest by your operating system where applicable.`,
      },
      {
        heading: "Network",
        body: "Network requests are made only when you use AI features, open external links, or when the development server connects during `npm run dev`. Production builds do not embed remote analytics by default.",
      },
      {
        heading: "Reporting vulnerabilities",
        body: `If you discover a security issue, email ${EMAILS.support} with details and steps to reproduce. We aim to acknowledge reports within 5 business days. Please do not disclose publicly until we have had a chance to respond.`,
      },
      {
        heading: "Best practices",
        body: "Use environment-specific API keys with spending limits. Prefer local models for sensitive code. Keep the IDE updated. Do not commit API keys to version control.",
      },
    ],
  },
};
