import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Sparkles,
  MeshTransmissionMaterial,
  ContactShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";

function useScrollProgress() {
  const ref = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      ref.current = Math.max(0, Math.min(1, window.scrollY / Math.max(1, h)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return ref;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 -2 * t);
};

/* Build a centered heart geometry */
function useHeartGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0,
      y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.08,
      bevelOffset: 0,
      bevelSegments: 8,
      curveSegments: 64,
    });
    geom.center();
    geom.rotateZ(Math.PI); // flip upright (point down)
    geom.scale(0.6, 0.6, 0.6);
    return geom;
  }, []);
}

const CAM_KEYS: { p: THREE.Vector3; l: THREE.Vector3 }[] = [
  { p: new THREE.Vector3(0, 0, 5.2), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(1.6, 0.4, 4.2), l: new THREE.Vector3(0, 0.1, 0) },
  { p: new THREE.Vector3(-1.4, -0.3, 3.8), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(0, 0.8, 3.2), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(0, 0, 5.8), l: new THREE.Vector3(0, 0, 0) },
];

function CameraRig({ progress }: { progress: { current: number } }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((_, dt) => {
    const p = progress.current * (CAM_KEYS.length - 1);
    const i = Math.floor(p);
    const f = p - i;
    const a = CAM_KEYS[Math.min(i, CAM_KEYS.length - 1)];
    const b = CAM_KEYS[Math.min(i + 1, CAM_KEYS.length - 1)];
    const tp = new THREE.Vector3().lerpVectors(a.p, b.p, smoothstep(0, 1, f));
    const tl = new THREE.Vector3().lerpVectors(a.l, b.l, smoothstep(0, 1, f));
    camera.position.x = damp(camera.position.x, tp.x, 2.5, dt);
    camera.position.y = damp(camera.position.y, tp.y, 2.5, dt);
    camera.position.z = damp(camera.position.z, tp.z, 2.5, dt);
    look.current.x = damp(look.current.x, tl.x, 2.5, dt);
    look.current.y = damp(look.current.y, tl.y, 2.5, dt);
    look.current.z = damp(look.current.z, tl.z, 2.5, dt);
    camera.lookAt(look.current);
  });
  return null;
}

function Hearts({ progress }: { progress: { current: number } }) {
  const geom = useHeartGeometry();
  const group = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const fused = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!group.current || !left.current || !right.current || !fused.current) return;
    const p = progress.current;
    const approach = smoothstep(0.05, 0.45, p);
    const meet = smoothstep(0.42, 0.6, p);
    const bloom = smoothstep(0.58, 0.82, p);
    const drift = smoothstep(0.82, 1, p);

    // Hearts approach from sides
    const startX = 2.6;
    const lx = lerp(-startX, 0, approach);
    const rx = lerp(startX, 0, approach);
    left.current.position.x = damp(left.current.position.x, lx, 3, dt);
    right.current.position.x = damp(right.current.position.x, rx, 3, dt);

    // Subtle tilt towards each other
    left.current.rotation.y = damp(left.current.rotation.y, lerp(-0.6, 0.15, approach), 2.5, dt);
    right.current.rotation.y = damp(right.current.rotation.y, lerp(0.6, -0.15, approach), 2.5, dt);

    // Fade individuals as they meet, reveal fused crystal heart
    const indOpacity = 1 - meet;
    (left.current.material as THREE.MeshPhysicalMaterial).opacity = indOpacity;
    (right.current.material as THREE.MeshPhysicalMaterial).opacity = indOpacity;
    (left.current.material as THREE.MeshPhysicalMaterial).transparent = true;
    (right.current.material as THREE.MeshPhysicalMaterial).transparent = true;

    const fScale = lerp(0, 1.35, meet) * lerp(1, 1.15, bloom) * lerp(1, 0.85, drift);
    fused.current.scale.setScalar(damp(fused.current.scale.x, fScale, 3, dt));
    fused.current.visible = meet > 0.01;

    // Gentle breathing rotation
    const t = state.clock.elapsedTime;
    fused.current.rotation.y = t * 0.25;
    fused.current.rotation.x = Math.sin(t * 0.4) * 0.08;
    left.current.rotation.z = Math.sin(t * 0.6) * 0.03;
    right.current.rotation.z = Math.sin(t * 0.6 + 1) * 0.03;

    group.current.position.y =
      Math.sin(t * 0.5) * 0.05 + lerp(0, -0.4, drift);
    group.current.rotation.z = damp(
      group.current.rotation.z,
      lerp(0, -Math.PI * 0.04, bloom),
      2,
      dt
    );
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh ref={left} geometry={geom} position={[-2.6, 0, 0]}>
          <meshPhysicalMaterial
            color="#b48cff"
            metalness={0.55}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#5b2a8a"
            emissiveIntensity={0.35}
            envMapIntensity={1.6}
          />
        </mesh>
        <mesh ref={right} geometry={geom} position={[2.6, 0, 0]}>
          <meshPhysicalMaterial
            color="#d9b8ff"
            metalness={0.7}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#3a1466"
            emissiveIntensity={0.3}
            envMapIntensity={1.8}
          />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={fused} geometry={geom} scale={0} visible={false}>
          <MeshTransmissionMaterial
            thickness={0.9}
            roughness={0.04}
            transmission={1}
            ior={1.7}
            chromaticAberration={0.45}
            anisotropy={0.25}
            distortion={0.18}
            distortionScale={0.35}
            color="#e8d6ff"
            attenuationColor="#6b2bb0"
            attenuationDistance={0.6}
            backside
          />
        </mesh>
      </Float>
    </group>
  );
}

function Petals({ progress }: { progress: { current: number } }) {
  const grp = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const r = 3.2 + (i % 4) * 0.55;
        return {
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r * 0.55,
          z: -2 + (i % 5) * 0.5,
        };
      }),
    []
  );
  useFrame((state, dt) => {
    if (!grp.current) return;
    const p = progress.current;
    const v = smoothstep(0.5, 0.78, p) * (1 - smoothstep(0.9, 1, p));
    grp.current.rotation.z += dt * 0.04;
    grp.current.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      m.scale.setScalar(damp(m.scale.x, v * 0.9, 2.5, dt));
      m.position.y =
        items[i].y + Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.14;
      m.rotation.x += dt * 0.4;
      m.rotation.y += dt * 0.3;
    });
  });
  return (
    <group ref={grp}>
      {items.map((it, i) => (
        <mesh key={i} position={[it.x, it.y, it.z]} scale={0}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshPhysicalMaterial
            color="#f3e9ff"
            metalness={0.4}
            roughness={0.2}
            emissive="#b48cff"
            emissiveIntensity={1.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const progress = useScrollProgress();
  return (
    <>
      <color attach="background" args={["#0a0418"]} />
      <fog attach="fog" args={["#0a0418", 7, 20]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} color="#d9b8ff" />
      <directionalLight position={[-5, -2, 3]} intensity={0.7} color="#6b2bb0" />
      <pointLight position={[0, 0, 3]} intensity={1.4} color="#f3e9ff" />
      <Suspense fallback={null}>
        <Environment preset="night" />
        <CameraRig progress={progress} />
        <Hearts progress={progress} />
        <Petals progress={progress} />
        <Sparkles
          count={140}
          scale={[14, 8, 6]}
          size={2.4}
          speed={0.25}
          color="#d9b8ff"
          opacity={0.6}
        />
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.4}
          scale={9}
          blur={2.8}
          far={4}
          color="#000"
        />
      </Suspense>
      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.6} luminanceSmoothing={0.35} mipmapBlur />
        <ChromaticAberration
          offset={[0.0006, 0.0009]}
          radialModulation={false}
          modulationOffset={0}
          blendFunction={BlendFunction.NORMAL}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

export function Scene3D() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <Scene />
      </Canvas>
    </div>
  );
}
