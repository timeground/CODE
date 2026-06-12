import { LandingSite } from "@timeground/landing";

interface Props {
  onOpenFolder: () => void;
  onOpenSettings: () => void;
}

export function HomePage({ onOpenFolder, onOpenSettings }: Props) {
  return (
    <LandingSite
      mode="ide"
      actions={{
        openExternal: (url) => window.timeground.openExternal(url),
      }}
      onOpenFolder={onOpenFolder}
      onOpenSettings={onOpenSettings}
    />
  );
}
