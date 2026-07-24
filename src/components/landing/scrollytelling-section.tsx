import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandMark } from "@/components/landing/brand-mark";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/*
  Five-stage pinned scrollytelling, rendered as a real Three.js scene.

  One ScrollTrigger pins the section for ~500vh and reports raw progress;
  a ticker eases toward it and calls update(p) — a PURE function of
  p ∈ [0,5] (plus a clock for idle float). Nothing is tweened statefully,
  so scrolling up replays every frame in reverse exactly.

  Typography stays in the DOM (crisp text beats extruded 3D type); the
  canvas carries the cards, constellation, connection lines, rings and
  the particle heart. Flat-shaded line-art materials only — no PBR, no
  bloom pass — so the look stays engraved/etched rather than "game-like".
*/

const GOLD = "#d9a760";
const GOLD_LIGHT = "#e0b876";
const ROSE = "#eca8d6";
const IVORY = "#f5e9dc";
const BG = 0x140c08;

const SCENES = [
  {
    n: "01",
    lead: "Start",
    accent: "privately.",
    copy: ["Tell us who you are.", "Nothing becomes public."],
    tag: "100% PRIVATE · NO PUBLIC PROFILES",
  },
  {
    n: "02",
    lead: "We",
    accent: "review",
    copy: ["We personally review every application with care.", "Values, family & intent matter."],
    tag: "CHECKED BY A REAL PERSON · NOT AN ALGORITHM",
  },
  {
    n: "03",
    lead: "We",
    accent: "curate.",
    copy: ["We look through the private circle and choose", "introductions worth making."],
    tag: "NO SWIPING · NO PUBLIC BROWSING",
  },
  {
    n: "04",
    lead: "We",
    accent: "introduce.",
    copy: ["When it feels right, we make a private introduction", "between two people who are open to it."],
    tag: "MUTUAL INTEREST · PRIVACY ALWAYS",
  },
  {
    n: "05",
    lead: "Then we",
    accent: "step away.",
    copy: ["The rest is between you two.", "We stay in the background, where we belong."],
    tag: "100% PRIVATE · NO PUBLIC PROFILES",
  },
] as const;

const FINAL_TAGS = [
  { label: "Private by design", icon: "lock" },
  { label: "Human reviewed", icon: "shield" },
  { label: "Intent focused", icon: "heart" },
  { label: "Meaningful introductions", icon: "family" },
] as const;

/* satellite cards for the "we curate" constellation — angle, radius,
   depth, tilt; three highlighted, index 0 becomes the chosen match */
const SATS = [
  { a: 0.3, r: 3.0, z: -1.2, rot: 0.22, hl: true },
  { a: 1.05, r: 2.6, z: -0.6, rot: -0.18, hl: false },
  { a: 1.62, r: 2.2, z: -1.6, rot: 0.12, hl: true },
  { a: 2.2, r: 2.9, z: -0.9, rot: -0.26, hl: false },
  { a: 2.85, r: 3.2, z: -1.4, rot: 0.18, hl: false },
  { a: 3.5, r: 2.5, z: -0.7, rot: -0.12, hl: true },
  { a: 4.1, r: 3.0, z: -1.5, rot: 0.2, hl: false },
  { a: 4.7, r: 2.3, z: -0.8, rot: -0.22, hl: false },
  { a: 5.3, r: 3.1, z: -1.1, rot: 0.08, hl: false },
  { a: 5.9, r: 2.7, z: -1.7, rot: -0.08, hl: false },
  { a: 0.75, r: 3.4, z: -2.0, rot: 0.04, hl: false },
] as const;

/* camera keyframes: [p, x, y, z] as offsets from the content centre */
const CAM_KEYS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.0, 0.55, 0.35, 6.4],
  [1.0, -0.9, 0.5, 5.8],
  [2.0, -0.2, 0.55, 6.2],
  [2.5, 0, 1.1, 11.6],
  [3.0, 0, 0.6, 9.6],
  [3.6, 0, 0.25, 7.4],
  [4.0, 0, 0.15, 6.9],
  [5.0, 0, 0.05, 6.2],
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ss = (t: number) => t * t * (3 - 2 * t); // smoothstep
const es = (p: number, a: number, b: number) => ss(seg(p, a, b));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type IconName = "heart" | "family" | "shield" | "lock";

function Icon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.4 5 5.6 4.3 8 3.8 10 5 12 7.4 14 5 16 3.8 18.4 4.3 21.6 5 22.8 8 21.3 11.2 19 15.6 12 20 12 20z" />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <circle cx="8.5" cy="8" r="2.6" />
          <circle cx="15.5" cy="8" r="2.6" />
          <path d="M3.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5M10.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M12 3l7 3v5c0 4.6-3 7.9-7 10-4-2.1-7-5.4-7-10V6l7-3z" />
          <path d="M9 12.2l2 2 4-4.2" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <rect x="5" y="11" width="14" height="9" rx="1.5" />
          <path d="M8 11V7.5a4 4 0 018 0V11" />
        </svg>
      );
  }
}

/* ---------- three.js construction helpers (module scope, no state) ---------- */

type Registry = { geos: THREE.BufferGeometry[]; mats: THREE.Material[]; texs: THREE.Texture[] };

function fadeMat<T extends THREE.Material>(reg: Registry, m: T, base: number): T {
  m.transparent = true;
  m.opacity = 0;
  m.userData.base = base;
  reg.mats.push(m);
  return m;
}
function setA(mats: THREE.Material[], a: number) {
  for (const m of mats) m.opacity = (m.userData.base as number) * a;
}

function roundedRectPoints(w: number, h: number, r: number, n = 10): THREE.Vector2[] {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s.getPoints(n);
}

function glowTexture(reg: Registry): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.9)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.25)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  reg.texs.push(t);
  return t;
}

/** outlined card: dark fill + gold line frame, opacity-fadeable as one unit */
function makeCard(reg: Registry, w: number, h: number, r: number, edge: string, fillBase = 0.82) {
  const group = new THREE.Group();
  const mats: THREE.Material[] = [];

  const pts = roundedRectPoints(w, h, r);
  const shape = new THREE.Shape(pts);
  const fillGeo = new THREE.ShapeGeometry(shape);
  reg.geos.push(fillGeo);
  const fillM = fadeMat(reg, new THREE.MeshBasicMaterial({ color: 0x1b1109, depthWrite: true }), fillBase);
  const fill = new THREE.Mesh(fillGeo, fillM);
  fill.renderOrder = 1;
  mats.push(fillM);

  const lineGeo = new THREE.BufferGeometry().setFromPoints([...pts, pts[0]]);
  reg.geos.push(lineGeo);
  const lineM = fadeMat(reg, new THREE.LineBasicMaterial({ color: edge }), 0.85);
  const outline = new THREE.Line(lineGeo, lineM);
  outline.renderOrder = 2;
  mats.push(lineM);

  group.add(fill, outline);
  return { group, mats, outlineMat: lineM as THREE.LineBasicMaterial };
}

function circlePoints(radius: number, n = 40, arcStart = 0, arcEnd = Math.PI * 2): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = arcStart + ((arcEnd - arcStart) * i) / n;
    out.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return out;
}

function makeLine(reg: Registry, pts: THREE.Vector3[], color: string, base: number, closed = false): { line: THREE.Line; mat: THREE.LineBasicMaterial } {
  const geo = new THREE.BufferGeometry().setFromPoints(closed ? [...pts, pts[0]] : pts);
  reg.geos.push(geo);
  const mat = fadeMat(reg, new THREE.LineBasicMaterial({ color }), base);
  const line = new THREE.Line(geo, mat);
  line.renderOrder = 3;
  return { line, mat };
}

/** avatar: head circle + shoulder arc, engraved-line style */
function makeAvatar(reg: Registry, scale: number, color: string) {
  const group = new THREE.Group();
  const mats: THREE.Material[] = [];
  const head = makeLine(reg, circlePoints(0.11 * scale), color, 0.9, true);
  head.line.position.y = 0.12 * scale;
  const shoulders = makeLine(reg, circlePoints(0.2 * scale, 24, Math.PI * 0.15, Math.PI * 0.85), color, 0.9);
  shoulders.line.position.y = -0.14 * scale;
  group.add(head.line, shoulders.line);
  mats.push(head.mat, shoulders.mat);
  return { group, mats };
}

/** heart outline points (classic parametric), centred, ~1.9 wide at s=0.062 */
function heartPoints(s: number, n = 140): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (Math.PI * 2 * i) / n + Math.PI; // start at bottom tip
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    out.push(new THREE.Vector3(x * s, y * s, 0));
  }
  return out;
}

export function ScrollytellingSection() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reg: Registry = { geos: [], mats: [], texs: [] };

    /* ---------- renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setClearColor(BG, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.028);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);

    const content = new THREE.Group();
    scene.add(content);

    const glowTex = glowTexture(reg);
    const makeGlow = (color: string, size: number, base: number) => {
      const m = fadeMat(
        reg,
        new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, depthWrite: false }),
        base,
      );
      const s = new THREE.Sprite(m);
      s.scale.setScalar(size);
      s.renderOrder = 6;
      return { sprite: s, mat: m };
    };

    /* ambient backdrop glow — the "lit from within" feel */
    const backGlow = makeGlow(GOLD, 9, 0.16);
    backGlow.sprite.position.set(0, 0, -3.5);
    content.add(backGlow.sprite);
    const backGlowRose = makeGlow(ROSE, 7, 0.1);
    backGlowRose.sprite.position.set(-1.5, 1, -4);
    content.add(backGlowRose.sprite);

    /* ---------- main profile card ---------- */
    const CW = 1.7;
    const CH = 2.3;
    const main = makeCard(reg, CW, CH, 0.12, GOLD);
    content.add(main.group);
    const mainGlow = makeGlow(GOLD, 3.6, 0.28);
    mainGlow.sprite.position.z = -0.4;
    main.group.add(mainGlow.sprite);

    // header: tiny interlocked brand rings + divider
    const headerMats: THREE.Material[] = [];
    {
      const r1 = makeLine(reg, circlePoints(0.075), GOLD, 0.9, true);
      r1.line.position.set(-0.05, 0.92, 0.01);
      const r2 = makeLine(reg, circlePoints(0.075), ROSE, 0.9, true);
      r2.line.position.set(0.05, 0.92, 0.01);
      const div = makeLine(
        reg,
        [new THREE.Vector3(-0.55, 0.74, 0.01), new THREE.Vector3(0.55, 0.74, 0.01)],
        GOLD,
        0.4,
      );
      main.group.add(r1.line, r2.line, div.line);
      headerMats.push(r1.mat, r2.mat, div.mat);
    }

    // scene 1 content: four field rows + lock
    const fieldUnits: THREE.Material[][] = [];
    const fieldsGroup = new THREE.Group();
    fieldsGroup.position.z = 0.01;
    main.group.add(fieldsGroup);
    for (let i = 0; i < 4; i++) {
      const y = 0.48 - i * 0.36;
      const mats: THREE.Material[] = [];
      const ring = makeLine(reg, circlePoints(0.045, 24), GOLD, 0.85, true);
      ring.line.position.set(-0.62, y, 0);
      mats.push(ring.mat);
      const bar1 = makeLine(reg, [new THREE.Vector3(-0.48, y + 0.04, 0), new THREE.Vector3(0.62, y + 0.04, 0)], IVORY, 0.35);
      const bar2 = makeLine(reg, [new THREE.Vector3(-0.48, y - 0.06, 0), new THREE.Vector3(0.22, y - 0.06, 0)], IVORY, 0.18);
      mats.push(bar1.mat, bar2.mat);
      fieldsGroup.add(ring.line, bar1.line, bar2.line);
      fieldUnits.push(mats);
    }
    const lockMats: THREE.Material[] = [];
    {
      const ring = makeLine(reg, circlePoints(0.1, 40), GOLD, 0.9, true);
      ring.line.position.set(0, -0.86, 0.01);
      const body = makeLine(
        reg,
        [
          new THREE.Vector3(-0.035, -0.885, 0.011),
          new THREE.Vector3(0.035, -0.885, 0.011),
          new THREE.Vector3(0.035, -0.835, 0.011),
          new THREE.Vector3(-0.035, -0.835, 0.011),
        ],
        GOLD,
        0.9,
        true,
      );
      const shackle = makeLine(reg, circlePoints(0.025, 16, 0, Math.PI), GOLD, 0.9);
      shackle.line.position.set(0, -0.835, 0.011);
      main.group.add(ring.line, body.line, shackle.line);
      lockMats.push(ring.mat, body.mat, shackle.mat);
    }

    // scene 2 content: three review rows, each with a check ring; rose seal
    const reviewUnits: { mats: THREE.Material[]; ring: THREE.Group }[] = [];
    for (let i = 0; i < 3; i++) {
      const y = 0.42 - i * 0.44;
      const mats: THREE.Material[] = [];
      const bar = makeLine(reg, [new THREE.Vector3(-0.62, y, 0.01), new THREE.Vector3(0.18, y, 0.01)], IVORY, 0.4);
      mats.push(bar.mat);
      const ringGroup = new THREE.Group();
      ringGroup.position.set(0.48, y, 0.01);
      const ring = makeLine(reg, circlePoints(0.085, 32), GOLD, 0.95, true);
      const tick = makeLine(
        reg,
        [new THREE.Vector3(-0.035, 0, 0.001), new THREE.Vector3(-0.005, -0.03, 0.001), new THREE.Vector3(0.045, 0.03, 0.001)],
        ROSE,
        1,
      );
      ringGroup.add(ring.line, tick.line);
      main.group.add(bar.line, ringGroup);
      mats.push(ring.mat, tick.mat);
      reviewUnits.push({ mats, ring: ringGroup });
    }
    const sealMats: THREE.Material[] = [];
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0.7, -0.92, 0.02);
    {
      const outer = makeLine(reg, circlePoints(0.17, 48), ROSE, 0.95, true);
      const inner = makeLine(reg, circlePoints(0.125, 40), ROSE, 0.5, true);
      const tick = makeLine(
        reg,
        [new THREE.Vector3(-0.06, 0, 0.001), new THREE.Vector3(-0.01, -0.05, 0.001), new THREE.Vector3(0.075, 0.05, 0.001)],
        GOLD,
        1,
      );
      sealGroup.add(outer.line, inner.line, tick.line);
      sealMats.push(outer.mat, inner.mat, tick.mat);
    }
    main.group.add(sealGroup);
    const sealGlow = makeGlow(ROSE, 0.9, 0.5);
    sealGroup.add(sealGlow.sprite);
    sealMats.push(sealGlow.mat);

    // avatar on the main card for scenes 4 (the person behind the form)
    const mainAvatar = makeAvatar(reg, 1.6, GOLD);
    mainAvatar.group.position.set(0, 0.05, 0.01);
    main.group.add(mainAvatar.group);

    /* ---------- satellites (scene 3) ---------- */
    const satsGroup = new THREE.Group();
    content.add(satsGroup);
    const satData = SATS.map((s) => {
      const pos = new THREE.Vector3(Math.cos(s.a) * s.r, Math.sin(s.a) * s.r * 0.62, s.z);
      const card = makeCard(reg, 0.62, 0.84, 0.06, s.hl ? GOLD : "#6b4f33", 0.7);
      card.group.position.copy(pos);
      card.group.rotation.y = s.rot;
      const avatar = makeAvatar(reg, 0.62, s.hl ? GOLD : "#6b4f33");
      avatar.group.position.set(0, 0.1, 0.01);
      card.group.add(avatar.group);
      const bar = makeLine(reg, [new THREE.Vector3(-0.18, -0.24, 0.01), new THREE.Vector3(0.18, -0.24, 0.01)], IVORY, 0.25);
      card.group.add(bar.line);
      const mats = [...card.mats, ...avatar.mats, bar.mat];
      let glowMat: THREE.Material | null = null;
      if (s.hl) {
        const glow = makeGlow(ROSE, 1.6, 0.4);
        glow.sprite.position.z = -0.2;
        card.group.add(glow.sprite);
        glowMat = glow.mat;
      }
      satsGroup.add(card.group);
      return { ...s, pos, group: card.group, mats, glowMat, outlineMat: card.outlineMat };
    });
    const chosen = satData[0];

    // dashed connection lines: main card -> each highlighted satellite
    const connections = satData
      .filter((s) => s.hl)
      .map((s) => {
        const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
        reg.geos.push(geo);
        const mat = fadeMat(
          reg,
          new THREE.LineDashedMaterial({ color: GOLD, dashSize: 0.09, gapSize: 0.06 }),
          0.7,
        );
        const line = new THREE.Line(geo, mat);
        line.renderOrder = 4;
        content.add(line);
        return { line, mat, target: s.pos };
      });

    /* ---------- scene 4: connection curve + mutual rings ---------- */
    const CURVE_SEGS = 60;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.62, 0, 0),
      new THREE.Vector3(0, -0.34, 0),
      new THREE.Vector3(0.62, 0, 0),
    );
    const tubeGeo = new THREE.TubeGeometry(curve, CURVE_SEGS, 0.013, 8, false);
    reg.geos.push(tubeGeo);
    {
      // vertex-colour gradient gold -> rose along the curve
      const pos = tubeGeo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      const cGold = new THREE.Color(GOLD);
      const cRose = new THREE.Color(ROSE);
      const tmp = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const t = clamp01((pos.getX(i) + 0.62) / 1.24);
        tmp.copy(cGold).lerp(cRose, t);
        colors[i * 3] = tmp.r;
        colors[i * 3 + 1] = tmp.g;
        colors[i * 3 + 2] = tmp.b;
      }
      tubeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
    const tubeMat = fadeMat(
      reg,
      new THREE.MeshBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false }),
      0.95,
    );
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.renderOrder = 5;
    content.add(tube);
    const tubeIndexCount = tubeGeo.index ? tubeGeo.index.count : 0;

    const ringsMats: THREE.Material[] = [];
    const ringsGroup = new THREE.Group();
    ringsGroup.position.set(0, 1.52, 0);
    {
      const rA = makeLine(reg, circlePoints(0.16, 48), GOLD, 0.95, true);
      rA.line.position.x = -0.11;
      const rB = makeLine(reg, circlePoints(0.16, 48), ROSE, 0.95, true);
      rB.line.position.x = 0.11;
      ringsGroup.add(rA.line, rB.line);
      ringsMats.push(rA.mat, rB.mat);
      const glow = makeGlow(GOLD_LIGHT, 1.1, 0.45);
      ringsGroup.add(glow.sprite);
      ringsMats.push(glow.mat);
    }
    content.add(ringsGroup);

    /* ---------- scene 5: heart line + particle heart ---------- */
    const HEART_S = 0.062;
    const heartPts = heartPoints(HEART_S);
    const heartGeo = new THREE.BufferGeometry().setFromPoints(heartPts);
    reg.geos.push(heartGeo);
    {
      const colors = new Float32Array(heartPts.length * 3);
      const cGold = new THREE.Color(GOLD);
      const cRose = new THREE.Color(ROSE);
      const tmp = new THREE.Color();
      for (let i = 0; i < heartPts.length; i++) {
        const t = i / (heartPts.length - 1);
        tmp.copy(cGold).lerp(cRose, Math.sin(t * Math.PI));
        colors[i * 3] = tmp.r;
        colors[i * 3 + 1] = tmp.g;
        colors[i * 3 + 2] = tmp.b;
      }
      heartGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
    const heartMat = fadeMat(reg, new THREE.LineBasicMaterial({ vertexColors: true }), 0.95);
    const heartLine = new THREE.Line(heartGeo, heartMat);
    heartLine.position.set(0, 0.18, 0);
    heartLine.renderOrder = 6;
    content.add(heartLine);
    heartGeo.setDrawRange(0, 0);

    const heartGlow = makeGlow(ROSE, 2.6, 0.35);
    heartGlow.sprite.position.set(0, 0.18, -0.3);
    content.add(heartGlow.sprite);

    // particle heart: scattered -> assembled, positions lerped in update()
    const P_COUNT = 900;
    const pStart = new Float32Array(P_COUNT * 3);
    const pEnd = new Float32Array(P_COUNT * 3);
    {
      // deterministic pseudo-random (mulberry32) so SSR/hydration stay stable
      let s0 = 1234567;
      const rnd = () => {
        s0 |= 0;
        s0 = (s0 + 0x6d2b79f5) | 0;
        let t = Math.imul(s0 ^ (s0 >>> 15), 1 | s0);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      for (let i = 0; i < P_COUNT; i++) {
        // start: loose sphere around the heart
        const th = rnd() * Math.PI * 2;
        const ph = Math.acos(rnd() * 2 - 1);
        const rr = 2.2 + rnd() * 2.2;
        pStart[i * 3] = Math.sin(ph) * Math.cos(th) * rr;
        pStart[i * 3 + 1] = 0.18 + Math.sin(ph) * Math.sin(th) * rr * 0.7;
        pStart[i * 3 + 2] = Math.cos(ph) * rr * 0.5;
        // end: filled heart (outline shrunk toward centre by sqrt for even fill)
        const t = rnd() * Math.PI * 2 + Math.PI;
        const u = Math.sqrt(rnd());
        const hx = 16 * Math.pow(Math.sin(t), 3) * HEART_S * u;
        const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * HEART_S * u;
        pEnd[i * 3] = hx;
        pEnd[i * 3 + 1] = 0.18 + hy;
        pEnd[i * 3 + 2] = (rnd() - 0.5) * 0.12;
      }
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pStart.slice(), 3));
    reg.geos.push(pGeo);
    const pMat = fadeMat(
      reg,
      new THREE.PointsMaterial({
        color: GOLD_LIGHT,
        size: 0.028,
        sizeAttenuation: true,
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      0.85,
    );
    const heartParticles = new THREE.Points(pGeo, pMat);
    heartParticles.renderOrder = 7;
    content.add(heartParticles);

    /* ---------- ambient dust, whole journey ---------- */
    const DUST = 320;
    const dustGeo = new THREE.BufferGeometry();
    {
      let s1 = 987654;
      const rnd = () => {
        s1 |= 0;
        s1 = (s1 + 0x6d2b79f5) | 0;
        let t = Math.imul(s1 ^ (s1 >>> 15), 1 | s1);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      const arr = new Float32Array(DUST * 3);
      for (let i = 0; i < DUST; i++) {
        arr[i * 3] = (rnd() - 0.5) * 14;
        arr[i * 3 + 1] = (rnd() - 0.5) * 8;
        arr[i * 3 + 2] = -3 + rnd() * 5;
      }
      dustGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    }
    reg.geos.push(dustGeo);
    const dustMat = fadeMat(
      reg,
      new THREE.PointsMaterial({
        color: GOLD,
        size: 0.02,
        sizeAttenuation: true,
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      0.3,
    );
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.renderOrder = 0;
    content.add(dust);

    /* ---------- DOM overlays ---------- */
    const texts = Array.from(root.querySelectorAll<HTMLElement>(".st-text"));
    const rules = Array.from(root.querySelectorAll<HTMLElement>(".st-rule-fill"));
    const tags = Array.from(root.querySelectorAll<HTMLElement>(".st-tag"));
    const statement = root.querySelector<HTMLElement>(".st-statement");
    const finalTags = Array.from(root.querySelectorAll<HTMLElement>(".st-final-tag"));

    /* ---------- layout / resize ---------- */
    let contentX = 0;
    let contentY = 0;
    const resize = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const desktop = w >= 1024;
      contentX = desktop ? Math.min(2.1, w / h) : 0;
      contentY = desktop ? 0 : -0.85;
      content.position.set(contentX, contentY, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- the one true update: everything from p ∈ [0,5] ---------- */
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const v3a = new THREE.Vector3();

    const update = (p: number, time: number) => {
      /* DOM: scene text crossfades, rules, tags */
      for (let i = 0; i < SCENES.length; i++) {
        const aIn = i === 0 ? 1 : es(p, i - 0.14, i + 0.02);
        const aOut = i === SCENES.length - 1 ? 1 : 1 - es(p, i + 0.84, i + 0.99);
        const a = aIn * aOut;
        if (texts[i]) {
          texts[i].style.opacity = String(a);
          texts[i].style.transform = `translateY(${(1 - a) * 14}px)`;
        }
        if (tags[i]) tags[i].style.opacity = String(a);
        if (rules[i]) rules[i].style.transform = `scaleX(${seg(p, i + 0.05, i + 0.9)})`;
      }
      if (statement) {
        const a = es(p, 4.48, 4.72);
        statement.style.opacity = String(a);
        statement.style.transform = `translateY(${(1 - a) * 14}px)`;
      }
      finalTags.forEach((el, i) => {
        const a = es(p, 4.6 + i * 0.07, 4.78 + i * 0.07);
        el.style.opacity = String(a);
        el.style.transform = `translateY(${(1 - a) * 10}px)`;
      });

      /* camera along keyframes */
      let k = 0;
      while (k < CAM_KEYS.length - 2 && p > CAM_KEYS[k + 1][0]) k++;
      const [pa, xa, ya, za] = CAM_KEYS[k];
      const [pb, xb, yb, zb] = CAM_KEYS[k + 1];
      const ct = ss(seg(p, pa, pb));
      camPos.set(contentX + mix(xa, xb, ct), contentY + mix(ya, yb, ct), mix(za, zb, ct));
      // gentle handheld drift
      camPos.x += Math.sin(time * 0.21) * 0.045;
      camPos.y += Math.sin(time * 0.17 + 2) * 0.035;
      camera.position.copy(camPos);
      camLook.set(contentX, contentY + 0.1, 0);
      camera.lookAt(camLook);

      /* main card visibility + drift + scene-4 slide */
      const mainA = es(p, -0.1, 0.12) * (1 - es(p, 3.98, 4.3));
      setA(main.mats, mainA);
      setA(headerMats, mainA * (1 - es(p, 2.95, 3.15))); // header yields to avatar in S4
      mainGlow.mat.opacity = (mainGlow.mat.userData.base as number) * mainA * (1 - 0.5 * es(p, 2.0, 2.5));
      const slide = ss(seg(p, 3.05, 3.5));
      main.group.position.x = -1.35 * slide;
      main.group.position.y = Math.sin(time * 0.6) * 0.035;
      main.group.rotation.y = Math.sin(time * 0.4) * 0.045 + mix(0, -0.14, es(p, 1.0, 1.3)) * (1 - es(p, 1.9, 2.1));

      /* scene 1: fields + lock */
      fieldUnits.forEach((mats, i) => {
        setA(mats, es(p, 0.1 + i * 0.13, 0.3 + i * 0.13) * (1 - es(p, 0.86, 0.99)));
      });
      setA(lockMats, es(p, 0.64, 0.8) * (1 - es(p, 0.86, 0.99)));

      /* scene 2: review rows + seal */
      reviewUnits.forEach((u, i) => {
        const a = es(p, 1.08 + i * 0.15, 1.28 + i * 0.15) * (1 - es(p, 1.88, 1.99));
        setA(u.mats, a);
        u.ring.scale.setScalar(mix(0.5, 1, a));
      });
      const sealA = es(p, 1.62, 1.8) * (1 - es(p, 1.88, 1.99));
      setA(sealMats, sealA);
      sealGroup.scale.setScalar(mix(0.6, 1, sealA));

      /* scene 4 avatar on main card */
      setA(mainAvatar.mats, es(p, 3.0, 3.25) * (1 - es(p, 3.98, 4.3)));

      /* scene 3: constellation */
      const satsIdle = Math.sin(time * 0.3) * 0.02;
      satsGroup.rotation.y = satsIdle * (1 - es(p, 2.95, 3.2));
      satData.forEach((s, i) => {
        const isChosen = s === chosen;
        const inA = es(p, 2.02 + i * 0.035, 2.2 + i * 0.035);
        const outA = isChosen ? 1 - es(p, 3.98, 4.3) : 1 - es(p, 2.88, 3.05);
        const a = inA * outA;
        setA(s.mats, a);
        if (s.glowMat) {
          const hlA = es(p, 2.45 + i * 0.02, 2.65 + i * 0.02);
          s.glowMat.opacity = (s.glowMat.userData.base as number) * a * hlA;
        }
        if (isChosen) {
          const t = ss(seg(p, 3.05, 3.5));
          s.group.position.set(mix(s.pos.x, 1.35, t), mix(s.pos.y, 0, t) + Math.sin(time * 0.6 + 1.7) * 0.035 * t, mix(s.pos.z, 0, t));
          s.group.rotation.y = mix(s.rot, 0, t);
          s.group.scale.setScalar(mix(1, 2.74, t));
          s.outlineMat.color.set(GOLD).lerp(new THREE.Color(ROSE), t);
        }
      });
      connections.forEach((c, j) => {
        const draw = es(p, 2.4 + j * 0.09, 2.62 + j * 0.09);
        const a = draw * (1 - es(p, 2.86, 2.98));
        c.mat.opacity = (c.mat.userData.base as number) * a;
        const posAttr = c.line.geometry.attributes.position as THREE.BufferAttribute;
        v3a.copy(c.target).multiplyScalar(draw);
        posAttr.setXYZ(1, v3a.x, v3a.y, v3a.z);
        posAttr.needsUpdate = true;
        c.line.computeLineDistances();
      });

      /* scene 4: connecting curve + mutual rings */
      const tubeDraw = es(p, 3.28, 3.62);
      const tubeA = tubeDraw * (1 - es(p, 4.2, 4.42));
      tubeMat.opacity = (tubeMat.userData.base as number) * tubeA;
      tubeGeo.setDrawRange(0, Math.floor((tubeIndexCount * tubeDraw) / 3) * 3);
      const ringsA = es(p, 3.6, 3.78) * (1 - es(p, 3.98, 4.25));
      setA(ringsMats, ringsA);
      ringsGroup.scale.setScalar(mix(0.7, 1, ringsA));
      ringsGroup.position.y = 1.52 + Math.sin(time * 0.7) * 0.03;

      /* scene 5: heart line draw-on + particle assembly */
      const heartDraw = es(p, 4.18, 4.66);
      heartMat.opacity = (heartMat.userData.base as number) * es(p, 4.18, 4.4);
      heartGeo.setDrawRange(0, Math.floor(heartPts.length * heartDraw));
      heartGlow.mat.opacity = (heartGlow.mat.userData.base as number) * es(p, 4.35, 4.7);
      heartLine.position.y = 0.18 + Math.sin(time * 0.5) * 0.02;

      const pt = ss(es(p, 4.02, 4.72));
      pMat.opacity = (pMat.userData.base as number) * es(p, 4.02, 4.3);
      const posAttr = pGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < P_COUNT * 3; i++) arr[i] = mix(pStart[i], pEnd[i], pt);
      posAttr.needsUpdate = true;
      heartParticles.position.y = Math.sin(time * 0.5) * 0.02;
      heartParticles.rotation.y = (1 - pt) * 0.4;

      /* ambient */
      dust.rotation.y = time * 0.014;
      dustMat.opacity = (dustMat.userData.base as number) * (0.7 + 0.3 * Math.sin(time * 0.4));
      backGlow.mat.opacity = (backGlow.mat.userData.base as number) * (0.8 + 0.2 * Math.sin(time * 0.3));
      backGlowRose.mat.opacity = (backGlowRose.mat.userData.base as number) * (0.7 + 0.3 * Math.sin(time * 0.23 + 1));

      renderer.render(scene, camera);
    };

    /* ---------- scroll wiring ---------- */
    let targetP = 0;
    let easedP = 0;
    let inView = true;
    let st: ScrollTrigger | null = null;

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(root);

    const tick = () => {
      if (!inView && Math.abs(targetP - easedP) < 0.001) return;
      easedP += (targetP - easedP) * 0.14;
      if (Math.abs(targetP - easedP) < 0.0004) easedP = targetP;
      update(easedP, gsap.ticker.time);
    };

    if (reduce) {
      // static final state, no pin, no motion
      update(5, 0);
    } else {
      st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => "+=" + window.innerHeight * 5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetP = self.progress * 5;
        },
      });
      gsap.ticker.add(tick);
      update(0, 0); // first paint
    }

    return () => {
      window.removeEventListener("resize", resize);
      io.disconnect();
      gsap.ticker.remove(tick);
      st?.kill();
      reg.geos.forEach((g) => g.dispose());
      reg.mats.forEach((m) => m.dispose());
      reg.texs.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <section id="journey" ref={rootRef} className="relative h-screen overflow-hidden bg-[#140c08]" style={{ color: IVORY }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* brand lockup, top-left, present throughout */}
      <div className="absolute top-8 left-6 z-20 flex items-center gap-2.5 lg:top-10 lg:left-16">
        <BrandMark size={26} />
        <span className="font-display text-xl" style={{ color: IVORY }}>
          Desi<span style={{ color: ROSE }}>♥</span>Herz
        </span>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto grid h-full max-w-[1400px] grid-cols-1 items-start px-6 pt-24 lg:grid-cols-2 lg:items-center lg:px-16 lg:pt-0">
        {/* LEFT: editorial text, crossfaded per scene by update(p) */}
        <div className="relative h-[240px] lg:h-[340px]">
          {SCENES.map((scene) => (
            <div key={scene.n} className="st-text absolute inset-0 flex flex-col justify-center" style={{ opacity: 0 }}>
              <span className="font-display text-6xl lg:text-8xl" style={{ color: GOLD }}>
                {scene.n}
              </span>
              <div className="relative my-5 h-px w-full max-w-[220px]" style={{ background: "rgba(245,233,220,0.15)" }}>
                <div className="st-rule-fill absolute inset-y-0 left-0 w-full origin-left" style={{ background: GOLD, transform: "scaleX(0)" }} />
              </div>
              <h2 className="font-display text-4xl leading-[1.05] lg:text-6xl">
                {scene.lead} <span className="text-foil">{scene.accent}</span>
              </h2>
              <div className="mt-4 space-y-1">
                {scene.copy.map((line) => (
                  <p key={line} className="text-base lg:text-lg" style={{ color: "rgba(245,233,220,0.75)" }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* per-scene tag, pinned under the text block */}
          <div className="absolute -bottom-3 left-0 lg:-bottom-6">
            {SCENES.map((scene) => (
              <div
                key={scene.n}
                className="st-tag absolute inline-flex items-center gap-3 font-mono text-xs tracking-[0.15em] whitespace-nowrap"
                style={{ color: "rgba(245,233,220,0.55)", opacity: 0 }}
              >
                <span style={{ color: GOLD }}>✦</span>
                {scene.tag}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: final statement + tags, overlaid on the 3D heart (scene 5) */}
        <div className="relative flex h-full items-end justify-center pb-[16vh] lg:items-center lg:pb-0">
          <div className="st-statement flex translate-y-[90px] flex-col items-center text-center lg:translate-y-[110px]" style={{ opacity: 0 }}>
            <p className="font-display text-xl lg:text-2xl" style={{ color: GOLD }}>
              Real connections. Real people.
            </p>
            <p className="font-display text-xl lg:text-2xl">
              <em className="font-accent" style={{ color: ROSE }}>
                That&rsquo;s
              </em>{" "}
              Desi<span style={{ color: ROSE }}>♥</span>Herz.
            </p>
            <div className="mt-8 flex gap-6 lg:gap-8">
              {FINAL_TAGS.map((t) => (
                <div key={t.label} className="st-final-tag flex flex-col items-center gap-2" style={{ opacity: 0 }}>
                  <Icon name={t.icon} className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: GOLD }} />
                  <span
                    className="max-w-[70px] text-center text-[9px] leading-tight lg:max-w-[80px] lg:text-[10px]"
                    style={{ color: "rgba(245,233,220,0.6)" }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
