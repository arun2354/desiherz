import { createFileRoute, redirect } from "@tanstack/react-router";

// The Impressum is a single German-language legal document regardless of
// which site language variant a visitor arrived from (see /impressum) —
// no need for a separate /de/impressum copy of the same content.
export const Route = createFileRoute("/de/impressum")({
  beforeLoad: () => {
    throw redirect({ to: "/impressum" });
  },
});
