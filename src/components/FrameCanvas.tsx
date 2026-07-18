import { useEffect, useRef, useState, type MutableRefObject } from "react";

/**
 * Draws a preloaded frame_XXXX.jpg sequence to a canvas, picking the frame
 * that matches progress.current (0..1). This is the "video-to-website"
 * technique: a short product video is extracted to stills with ffmpeg, then
 * scroll scrubs through them instead of playing them back in real time.
 *
 * Falls back to a plain placeholder ring until the frames exist, so the
 * section never renders broken images.
 */
export function FrameCanvas({
  frameCount,
  framePath,
  padLength = 4,
  ext = "jpg",
  progress,
}: {
  frameCount: number;
  framePath: string;
  padLength?: number;
  ext?: string;
  progress: MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const frameSrc = (i: number) => `${framePath}${String(i).padStart(padLength, "0")}.${ext}`;

  useEffect(() => {
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (cancelled) return;
      const imgs: HTMLImageElement[] = [];
      let loaded = 0;
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === frameCount && !cancelled) setReady(true);
        };
        img.src = frameSrc(i);
        imgs.push(img);
      }
      imagesRef.current = imgs;
    };
    probe.onerror = () => {
      if (!cancelled) setFailed(true);
    };
    probe.src = frameSrc(1);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, framePath, padLength, ext]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const draw = () => {
      const idx = Math.min(frameCount - 1, Math.max(0, Math.round(progress.current * (frameCount - 1))));
      const img = imagesRef.current[idx];
      if (img && img.complete && img.naturalWidth) {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [ready, frameCount, progress]);

  if (failed || frameCount <= 0) {
    return (
      <div className="frame-placeholder" aria-hidden="true">
        <div className="frame-placeholder-ring" />
      </div>
    );
  }

  return (
    <div className="frame-canvas-wrap" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
