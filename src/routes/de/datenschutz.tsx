import { createFileRoute, redirect } from "@tanstack/react-router";

// Same reasoning as de/impressum.tsx — Datenschutz is a single
// German-language legal document, not duplicated per site-language variant.
export const Route = createFileRoute("/de/datenschutz")({
  beforeLoad: () => {
    throw redirect({ to: "/datenschutz" });
  },
});
