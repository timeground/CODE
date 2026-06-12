import type { CSSProperties } from "react";

export type TimeGroundLogoSize = "sm" | "md" | "lg" | "hero";

const SIZE_STYLES: Record<TimeGroundLogoSize, CSSProperties> = {
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 16 },
  hero: { fontSize: "clamp(13px, 2vw, 16px)" },
};

interface Props {
  size?: TimeGroundLogoSize;
  className?: string;
}

export function TimeGroundLogo({ size = "md", className }: Props) {
  return (
    <span
      className={`tg-logo ${className ?? ""}`.trim()}
      style={SIZE_STYLES[size]}
      aria-label="TimeGround Code"
    >
      TIMEGROUND CODE
    </span>
  );
}
