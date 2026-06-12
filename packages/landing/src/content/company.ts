export const COMPANY = {
  name: "TimeGround LLP",
  product: "TimeGround Code",
  tagline: "Build quietly. Let the work speak the loudest.",
  description:
    "The AI-native code editor that routes every task to the right model — maximum quality, minimum waste.",
  website: "https://timeground.in",
  foundedYear: 2026,
} as const;

export const RELEASE = {
  version: "0.1.0",
  label: "v0.1.0",
  date: "June 2026",
  requirements: "Windows 10+, macOS 12+, or Ubuntu 20.04+ · Node 20+ for development builds",
} as const;

export const EMAILS = {
  hello: "hello@timeground.in",
  sales: "sales@timeground.in",
  demo: "demo@timeground.in",
  contact: "contact@timeground.in",
  support: "support@timeground.in",
  social: "social@timeground.in",
} as const;

export const LINKS = {
  home: "https://timeground.in",
  download: "https://timeground.in/download",
  privacy: "https://timeground.in/privacy",
  terms: "https://timeground.in/terms",
  security: "https://timeground.in/security",
  docs: "https://timeground.in/docs",
  github: "https://github.com/timeground",
} as const;

/** Installer URLs — host these at timeground.in/download when releases ship */
export const DOWNLOADS = {
  windows: {
    label: "Windows",
    sublabel: "x64 installer",
    file: "TimeGround-Code-Setup-0.1.0.exe",
    url: `${LINKS.download}/TimeGround-Code-Setup-0.1.0.exe`,
  },
  mac: {
    label: "macOS",
    sublabel: "Apple Silicon & Intel",
    file: "TimeGround-Code-0.1.0.dmg",
    url: `${LINKS.download}/TimeGround-Code-0.1.0.dmg`,
  },
  linux: {
    label: "Linux",
    sublabel: "AppImage",
    file: "TimeGround-Code-0.1.0.AppImage",
    url: `${LINKS.download}/TimeGround-Code-0.1.0.AppImage`,
  },
} as const;

export const CONTACT_CHANNELS = [
  {
    id: "support",
    label: "Help & support",
    email: EMAILS.support,
    description: "Bug reports, how-to questions, and technical issues",
  },
  {
    id: "sales",
    label: "Sales & enterprise",
    email: EMAILS.sales,
    description: "Teams, licensing, and custom deployments",
  },
  {
    id: "demo",
    label: "Request a demo",
    email: EMAILS.demo,
    description: "See TimeGround Code in action with your stack",
  },
  {
    id: "hello",
    label: "General inquiries",
    email: EMAILS.hello,
    description: "Partnerships, feedback, and everything else",
  },
  {
    id: "social",
    label: "Press & social",
    email: EMAILS.social,
    description: "Media, community, and brand collaborations",
  },
] as const;

export const SITE_NAV = [
  { id: "features", label: "Features" },
  { id: "how", label: "How it works" },
  { id: "download", label: "Download" },
  { id: "contact", label: "Contact" },
] as const;
