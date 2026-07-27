import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BrandMark } from "@/components/landing/brand-mark";

// A brief gate on just the truly critical stuff — webfonts and the hero
// poster image — so the page never flashes unstyled/fallback-font text
// or a blank hero before its background is ready. Deliberately NOT
// waiting on the hero video or anything below the fold: those are much
// larger and load progressively in the background regardless, and
// blocking on them would mean a 30+ second blank screen on an average
// connection instead of a fraction of a second. Capped at 1.2s so a
// slow/failed font or image load can never hold the page hostage.
function CriticalLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    const fontsPromise = "fonts" in document ? document.fonts.ready : Promise.resolve();
    const posterPromise = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = window.matchMedia("(max-width: 767px)").matches
        ? "/images/hero-poster-mobile.jpg"
        : "/images/hero-poster.jpg";
    });

    Promise.all([fontsPromise, posterPromise]).then(finish);
    const timeout = setTimeout(finish, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#140c08] transition-opacity duration-500 ease-out"
      style={{ opacity: ready ? 0 : 1, pointerEvents: ready ? "none" : "auto" }}
    >
      <BrandMark size={40} />
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DesiHerz — Private Matrimony" },
      {
        name: "description",
        content: "DesiHerz is a private matrimony house for discerning people and families.",
      },
      // sane default so every route is explicitly index,follow unless it
      // opts out (impressum/datenschutz set their own noindex, follow)
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "DesiHerz" },
      { property: "og:locale", content: "en_DE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#140c08" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // /impressum and /datenschutz are always German content — a legal
  // requirement under German law — regardless of which language variant
  // of the marketing site the visitor came from, so they're "de" even
  // though they're not under the /de prefix.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = pathname.startsWith("/de") || pathname === "/impressum" || pathname === "/datenschutz" ? "de" : "en";

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CriticalLoader />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
