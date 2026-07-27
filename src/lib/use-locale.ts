import { useRouter } from "@tanstack/react-router";

export type Locale = "en" | "de";

const localeFromPathname = (pathname: string): Locale => (pathname === "/de" || pathname.startsWith("/de/") ? "de" : "en");

// A language switch is always a full page navigation (see the comment in
// navigation.tsx), never a client-side route transition — so no component
// needs to *react* to a locale change mid-lifetime, only read it once.
// useRouter() (not useRouterState()) reads the router's current location
// without subscribing to it: useRouterState's selector re-runs on every
// store update — including this site's scroll-restoration tracking, which
// writes on every scroll tick — which was forcing every section using this
// hook to re-render on scroll and starving the scrollytelling rAF loop of
// main-thread time. useRouter() still works correctly during SSR (the
// router's state is already populated from the request URL by then), it
// just doesn't re-render this component when that state later changes.
export function useLocale(): Locale {
  const router = useRouter();
  return localeFromPathname(router.state.location.pathname);
}
