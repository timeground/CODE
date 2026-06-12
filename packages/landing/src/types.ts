export interface LandingActions {
  openExternal: (url: string) => void | Promise<void>;
}

export interface LandingSiteProps {
  mode: "web" | "ide";
  actions: LandingActions;
  onOpenFolder?: () => void;
  onOpenSettings?: () => void;
}

export type Platform = "windows" | "mac" | "linux" | "unknown";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "windows";
  if (ua.includes("Mac")) return "mac";
  if (ua.includes("Linux")) return "linux";
  return "unknown";
}
