import { useEffect, type RefObject } from "react";

type DeviceKind = "desktop" | "mobile";
type Frame = ImageBitmap | HTMLImageElement;

type Step = {
  n: string;
  title: string;
  enter: number;
  leave: number;
};

type ScrollytellingRefs = {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  captionRefs: RefObject<(HTMLDivElement | null)[]>;
  barFillRef: RefObject<HTMLSpanElement | null>;
  counterRef: RefObject<HTMLSpanElement | null>;
  entryFadeRef: RefObject<HTMLDivElement | null>;
  steps: readonly Step[];
};

const BASE_PATH = "/scrollytelling/hero";
const DEFAULT_FRAME_COUNT = 348;

const configFor = (device: DeviceKind) =>
  device === "mobile"
    ? {
        cacheLimit: 28,
        preloadBehind: 8,
        preloadAhead: 18,
        concurrency: 3,
        maxDpr: 1.25,
      }
    : {
        cacheLimit: 48,
        preloadBehind: 14,
        preloadAhead: 30,
        concurrency: 3,
        maxDpr: 1,
      };

const frameWidth = (frame: Frame) =>
  "naturalWidth" in frame ? frame.naturalWidth || frame.width : frame.width;

const frameHeight = (frame: Frame) =>
  "naturalHeight" in frame ? frame.naturalHeight || frame.height : frame.height;

const smoothstep = (value: number) => value * value * (3 - 2 * value);

export function useScrollytellingFrames({
  containerRef,
  canvasRef,
  captionRefs,
  barFillRef,
  counterRef,
  entryFadeRef,
  steps,
}: ScrollytellingRefs) {
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deviceQuery = window.matchMedia("(max-width: 767px)");
    let device: DeviceKind = deviceQuery.matches ? "mobile" : "desktop";
    let frameCount = DEFAULT_FRAME_COUNT;
    let cache: (Frame | undefined)[] = new Array(frameCount);
    let lastAccess: number[] = new Array(frameCount).fill(0);
    let accessTick = 0;
    let residentCount = 0;
    let currentTarget = reducedMotion ? frameCount - 1 : 0;
    let previousTarget = currentTarget;
    let scrollDirection = 1;
    let lastDrawn = -1;
    let lastProgress = -1;
    let activeStep = -1;
    let lastEntryOpacity = -1;
    let containerTop = 0;
    let containerHeight = 0;
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;
    let generation = 0;
    let rafId = 0;
    let active = false;
    let cancelled = false;
    const inFlight = new Map<number, number>();
    const failureCount = new Map<number, number>();
    const lastCaptionOpacities = new Array(steps.length).fill(-1);

    const framePath = (kind: DeviceKind, index: number) =>
      `${BASE_PATH}/${kind}/frame_${String(index + 1).padStart(5, "0")}.webp`;

    const touch = (index: number) => {
      lastAccess[index] = ++accessTick;
    };

    const releaseFrame = (frame: Frame | undefined) => {
      if (frame && "close" in frame) frame.close();
    };

    const clearCache = () => {
      cache.forEach(releaseFrame);
      cache = new Array(frameCount);
      lastAccess = new Array(frameCount).fill(0);
      residentCount = 0;
      lastDrawn = -1;
      canvas.style.opacity = "0";
    };

    const evictLeastRecentlyUsed = () => {
      const { cacheLimit } = configFor(device);
      while (residentCount > cacheLimit) {
        let oldestIndex = -1;
        let oldestTick = Number.POSITIVE_INFINITY;
        for (let index = 0; index < cache.length; index++) {
          if (
            cache[index] &&
            index !== lastDrawn &&
            index !== currentTarget &&
            lastAccess[index] < oldestTick
          ) {
            oldestTick = lastAccess[index];
            oldestIndex = index;
          }
        }
        if (oldestIndex < 0) return;
        releaseFrame(cache[oldestIndex]);
        cache[oldestIndex] = undefined;
        residentCount--;
      }
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, configFor(device).maxDpr);
      const width = Math.max(1, Math.round(window.innerWidth * dpr));
      const height = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    const measure = () => {
      const rect = container.getBoundingClientRect();
      containerTop = rect.top + window.scrollY;
      containerHeight = rect.height;
    };

    const progress = () => {
      if (reducedMotion) return 1;
      const total = Math.max(1, containerHeight - viewportHeight);
      return Math.min(1, Math.max(0, (window.scrollY - containerTop) / total));
    };

    const drawFrame = (index: number) => {
      const frame = cache[index];
      if (!frame) return;
      const imageWidth = frameWidth(frame);
      const imageHeight = frameHeight(frame);
      const scale = Math.max(canvas.width / imageWidth, canvas.height / imageHeight);
      const drawWidth = imageWidth * scale;
      const drawHeight = imageHeight * scale;
      context.drawImage(
        frame,
        Math.round((canvas.width - drawWidth) / 2),
        Math.round((canvas.height - drawHeight) / 2),
        Math.ceil(drawWidth),
        Math.ceil(drawHeight),
      );
      lastDrawn = index;
      touch(index);
      canvas.style.opacity = "1";
    };

    const nearestResidentFrame = (target: number) => {
      if (cache[target]) return target;
      for (let distance = 1; distance < frameCount; distance++) {
        const preferred = target + distance * scrollDirection;
        const opposite = target - distance * scrollDirection;
        if (preferred >= 0 && preferred < frameCount && cache[preferred]) return preferred;
        if (opposite >= 0 && opposite < frameCount && cache[opposite]) return opposite;
      }
      return -1;
    };

    const updateCaptions = (value: number) => {
      const fade = 0.045;
      let activeIndex = 0;

      steps.forEach((step, index) => {
        const element = captionRefs.current[index];
        let opacity = 0;
        if (value >= step.enter - fade && value <= step.enter) {
          opacity = smoothstep((value - (step.enter - fade)) / fade);
        } else if (value > step.enter && value < step.leave) {
          opacity = 1;
        } else if (value >= step.leave && value <= step.leave + fade) {
          opacity = 1 - smoothstep((value - step.leave) / fade);
        }
        if (element && Math.abs(opacity - lastCaptionOpacities[index]) > 0.01) {
          element.style.opacity = String(opacity);
          element.style.transform = `translateY(${(1 - opacity) * 14}px)`;
          element.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
          lastCaptionOpacities[index] = opacity;
        }
        if (value >= step.enter - fade && value < step.leave + fade) activeIndex = index;
      });

      if (entryFadeRef.current) {
        const entryOpacity = 1 - smoothstep(Math.min(value / 0.06, 1));
        if (Math.abs(entryOpacity - lastEntryOpacity) > 0.01) {
          entryFadeRef.current.style.opacity = String(entryOpacity);
          lastEntryOpacity = entryOpacity;
        }
      }
      if (barFillRef.current) barFillRef.current.style.transform = `scaleX(${value})`;
      if (counterRef.current && activeStep !== activeIndex) {
        counterRef.current.textContent = `${steps[activeIndex].n} / 06 — ${steps[activeIndex].title}`;
        activeStep = activeIndex;
      }
    };

    const requestRender = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const decodeFrame = async (
      kind: DeviceKind,
      index: number,
      runGeneration: number,
    ): Promise<Frame | undefined> => {
      let blob: Blob;
      try {
        const response = await fetch(framePath(kind, index), { cache: "force-cache" });
        if (!response.ok) return undefined;
        blob = await response.blob();
      } catch {
        return undefined;
      }

      if (typeof createImageBitmap === "function") {
        try {
          const sourceWidth = kind === "mobile" ? 1080 : 1920;
          const sourceHeight = kind === "mobile" ? 1920 : 1080;
          const coverScale = Math.min(
            1,
            Math.max(canvas.width / sourceWidth, canvas.height / sourceHeight),
          );
          const bitmap = await createImageBitmap(blob, {
            resizeWidth: Math.max(1, Math.round(sourceWidth * coverScale)),
            resizeHeight: Math.max(1, Math.round(sourceHeight * coverScale)),
            resizeQuality: "high",
          });
          if (cancelled || runGeneration !== generation || !active) {
            bitmap.close();
            return undefined;
          }
          return bitmap;
        } catch {
          // Older Safari versions expose createImageBitmap but reject resize
          // options. The image element fallback below still keeps it working.
        }
      }

      return new Promise((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () =>
          resolve(cancelled || runGeneration !== generation || !active ? undefined : image);
        image.onerror = () => resolve(undefined);
        image.src = framePath(kind, index);
      });
    };

    const ensureFrame = async (index: number, runGeneration: number) => {
      if (
        index < 0 ||
        index >= frameCount ||
        cache[index] ||
        inFlight.has(index) ||
        (failureCount.get(index) ?? 0) >= 2
      ) {
        if (cache[index]) touch(index);
        return;
      }

      inFlight.set(index, runGeneration);
      const frame = await decodeFrame(device, index, runGeneration);
      if (inFlight.get(index) === runGeneration) inFlight.delete(index);
      if (cancelled || runGeneration !== generation || !active) {
        releaseFrame(frame);
        return;
      }
      if (!frame) {
        failureCount.set(index, (failureCount.get(index) ?? 0) + 1);
        return;
      }
      cache[index] = frame;
      residentCount++;
      touch(index);
      failureCount.delete(index);
      evictLeastRecentlyUsed();
      requestRender();
    };

    const preloadLoop = async (runGeneration: number) => {
      while (!cancelled && active && runGeneration === generation) {
        const config = configFor(device);
        const behind = scrollDirection > 0 ? config.preloadBehind : config.preloadAhead;
        const ahead = scrollDirection > 0 ? config.preloadAhead : config.preloadBehind;
        const low = Math.max(0, currentTarget - behind);
        const high = Math.min(frameCount - 1, currentTarget + ahead);
        const missing: number[] = [];

        for (let index = low; index <= high; index++) {
          if (
            !cache[index] &&
            !inFlight.has(index) &&
            (failureCount.get(index) ?? 0) < 2
          ) {
            missing.push(index);
          }
        }
        missing.sort((a, b) => Math.abs(a - currentTarget) - Math.abs(b - currentTarget));

        const availableSlots = Math.max(0, config.concurrency - inFlight.size);
        if (missing.length === 0 || availableSlots === 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 24));
          continue;
        }
        await Promise.all(
          missing.slice(0, availableSlots).map((index) => ensureFrame(index, runGeneration)),
        );
      }
    };

    function render() {
      rafId = 0;
      if (!active || frameCount <= 0) return;
      const value = progress();
      const nextTarget = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(value * (frameCount - 1))),
      );
      if (nextTarget !== currentTarget) {
        previousTarget = currentTarget;
        currentTarget = nextTarget;
        scrollDirection = currentTarget >= previousTarget ? 1 : -1;
      }

      const frameToDraw = nearestResidentFrame(currentTarget);
      if (frameToDraw >= 0 && frameToDraw !== lastDrawn) drawFrame(frameToDraw);
      if (inFlight.size < configFor(device).concurrency) {
        void ensureFrame(currentTarget, generation);
      }
      if (Math.abs(value - lastProgress) >= 0.0005) {
        lastProgress = value;
        updateCaptions(value);
      }
    }

    const activate = async () => {
      if (active) return;
      active = true;
      const runGeneration = ++generation;
      frameCount = DEFAULT_FRAME_COUNT;
      currentTarget = reducedMotion ? frameCount - 1 : Math.round(progress() * (frameCount - 1));
      previousTarget = currentTarget;
      lastProgress = -1;
      failureCount.clear();
      clearCache();
      sizeCanvas();
      measure();

      void fetch(`${BASE_PATH}/${device}/manifest.json`, { cache: "force-cache" })
        .then((response) => (response.ok ? response.json() : null))
        .then((manifest) => {
          if (
            runGeneration === generation &&
            manifest &&
            typeof manifest.count === "number" &&
            manifest.count > 0
          ) {
            frameCount = manifest.count;
          }
        })
        .catch(() => undefined);

      await ensureFrame(currentTarget, runGeneration);
      if (runGeneration !== generation || !active) return;
      requestRender();
      void preloadLoop(runGeneration);
    };

    const deactivate = () => {
      if (!active) return;
      active = false;
      generation++;
      inFlight.clear();
      clearCache();
    };

    const onResize = () => {
      const widthChanged = Math.abs(window.innerWidth - viewportWidth) > 2;
      if (device === "mobile" && !widthChanged) return;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      sizeCanvas();
      measure();
      lastDrawn = -1;
      requestRender();
    };

    const onDeviceChange = () => {
      const next: DeviceKind = deviceQuery.matches ? "mobile" : "desktop";
      if (next === device) return;
      device = next;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      deactivate();
      void activate();
    };

    sizeCanvas();
    measure();
    updateCaptions(reducedMotion ? 1 : progress());

    const observer = new IntersectionObserver(
      (entries) => {
        const isNear = entries.some((entry) => entry.isIntersecting);
        if (isNear) {
          measure();
          void activate();
        } else {
          deactivate();
        }
      },
      { rootMargin: "180% 0px 180% 0px" },
    );

    observer.observe(container);
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", onResize);
    deviceQuery.addEventListener("change", onDeviceChange);

    return () => {
      cancelled = true;
      active = false;
      generation++;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", onResize);
      deviceQuery.removeEventListener("change", onDeviceChange);
      clearCache();
    };
    // Language switching navigates and remounts the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
