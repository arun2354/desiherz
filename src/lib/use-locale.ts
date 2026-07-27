import { useRouterState } from "@tanstack/react-router";

export type Locale = "en" | "de";

// The /de prefix is the only signal we need — no context/provider required,
// every component can just ask the router directly wherever it needs to
// localize copy.
export function useLocale(): Locale {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname === "/de" || pathname.startsWith("/de/") ? "de" : "en";
}
