import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/landing/home-page";
import { buildHomeHead } from "@/lib/site-meta";

export const Route = createFileRoute("/de/")({
  head: () => buildHomeHead("de"),
  component: HomePage,
});
