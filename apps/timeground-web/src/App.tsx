import { LandingSite } from "@timeground/landing";

export default function App() {
  return (
    <LandingSite
      mode="web"
      actions={{
        openExternal: (url) => {
          window.open(url, "_blank", "noopener,noreferrer");
        },
      }}
    />
  );
}
