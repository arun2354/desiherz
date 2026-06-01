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
import { useEffect, useRef, useState, Suspense } from "react";
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
  return t * t * (3 - 2 * t);
};

// Scroll keyframes for camera (position + lookAt)
const CAM_KEYS: { p: THREE.Vector3; l: THREE.Vector3 }[] = [
  { p: new THREE.Vector3(0, 0, 4.6), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(2.2, 0.6, 3.4), l: new THREE.Vector3(0, 0.1, 0) },
  { p: new THREE.Vector3(-2.0, -0.4, 3.0), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(0, 1.4, 2.4), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(0, 0, 5.2), l: new THREE.Vector3(0, 0, 0) },
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
    const targetP = new THREE.Vector3().lerpVectors(a.p, b.p, smoothstep(0, 1, f));
    const targetL = new THREE.Vector3().lerpVectors(a.l, b.l, smoothstep(0, 1, f));
    camera.position.x = damp(camera.position.x, targetP.x, 3, dt);
    camera.position.y = damp(camera.position.y, targetP.y, 3, dt);
    camera.position.z = damp(camera.position.z, targetP.z, 3, dt);
    look.current.x = damp(look.current.x, targetL.x, 3, dt);
    look.current.y = damp(look.current.y, targetL.y, 3, dt);
    look.current.z = damp(look.current.z, targetL.z, 3, dt);
    camera.lookAt(look.current);
  });
  return null;
}

function Centerpiece({ progress }: { progress: { current: number } }) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const gem = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!group.current || !ringA.current || !ringB.current || !gem.current) return;
    const p = progress.current;
    const split = smoothstep(0.08, 0.3, p);
    const orbit = smoothstep(0.28, 0.55, p);
    const reunite = smoothstep(0.55, 0.78, p);
    const finale = smoothstep(0.78, 1, p);

    ringA.current.rotation.x += dt * 0.4;
    ringA.current.rotation.y += dt * 0.15;
    ringB.current.rotation.x += dt * 0.3;
    ringB.current.rotation.y -= dt * 0.45;
    gem.current.rotation.y += dt * 0.6;
    gem.current.rotation.x += dt * 0.25;

    const off = lerp(0, 1.9, split) - lerp(0, 1.3, reunite);
    ringA.current.position.x = damp(ringA.current.position.x, -off, 4, dt);
    ringB.current.position.x = damp(ringB.current.position.x, off, 4, dt);
    ringA.current.position.y = damp(ringA.current.position.y, lerp(0, 0.5, orbit), 4, dt);
    ringB.current.position.y = damp(ringB.current.position.y, lerp(0, -0.5, orbit), 4, dt);

    const s = lerp(1, 1.35, reunite) * lerp(1, 0.7, finale);
    group.current.scale.setScalar(damp(group.current.scale.x, s, 3, dt));
    group.current.rotation.z = damp(
      group.current.rotation.z,
      lerp(0, Math.PI * 0.12, orbit) + lerp(0, -Math.PI * 0.06, finale),
      2.5,
      dt
    );

    const breath = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    group.current.position.y = breath + lerp(0, -0.6, finale);
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={ringA}>
          <torusGeometry args={[1.1, 0.09, 80, 240]} />
          <meshPhysicalMaterial
            color="#e8c278"
            metalness={1}
            roughness={0.14}
            clearcoat={1}
            envMapIntensity={2.2}
          />
        </mesh>
        <mesh ref={ringB} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.1, 0.09, 80, 240]} />
          <meshPhysicalMaterial
            color="#c9a04a"
            metalness={1}
            roughness={0.2}
            clearcoat={1}
            envMapIntensity={1.8}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh ref={gem}>
          <octahedronGeometry args={[0.42, 0]} />
          <MeshTransmissionMaterial
            thickness={0.7}
            roughness={0.02}
            transmission={1}
            ior={2.4}
            chromaticAberration={0.6}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.4}
            color="#f5ede0"
            attenuationColor="#7a2035"
            attenuationDistance={0.55}
            backside
          />
        </mesh>
      </Float>
    </group>
  );
}

function Constellation({ progress }: { progress: { current: number } }) {
  const grp = useRef<THREE.Group>(null);
  const items = Array.from({ length: 18 }).map((_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const r = 3.6 + (i % 4) * 0.5;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r * 0.5,
      z: -2 + (i % 5) * 0.4,
      seed: i,
    };
  });

  useFrame((state, dt) => {
    if (!grp.current) return;
    const p = progress.current;
    const v = smoothstep(0.25, 0.55, p) * (1 - smoothstep(0.85, 1, p));
    grp.current.rotation.z += dt * 0.05;
    grp.current.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      m.scale.setScalar(damp(m.scale.x, v, 3, dt));
      m.position.y = items[i].y + Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.12;
      m.rotation.x += dt * 0.4;
      m.rotation.y += dt * 0.3;
    });
  });

  return (
    <group ref={grp}>
      {items.map((it, i) => (
        <mesh key={i} position={[it.x, it.y, it.z]} scale={0}>
          <octahedronGeometry args={[0.085, 0]} />
          <meshPhysicalMaterial
            color="#f5ede0"
            metalness={0.7}
            roughness={0.1}
            emissive="#c9a04a"
            emissiveIntensity={0.9}
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
      <color attach="background" args={["#09050a"]} />
      <fog attach="fog" args={["#09050a", 7, 18]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#e8c278" />
      <directionalLight position={[-5, -2, 3]} intensity={0.6} color="#7a2035" />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#f5ede0" />
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
        <CameraRig progress={progress} />
        <Centerpiece progress={progress} />
        <Constellation progress={progress} />
        <Sparkles count={120} scale={[12, 7, 5]} size={2.6} speed={0.2} color="#e8c278" opacity={0.55} />
        <ContactShadows position={[0, -1.6, 0]} opacity={0.35} scale={8} blur={2.6} far={4} color="#000" />
      </Suspense>
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.3} mipmapBlur />
        <ChromaticAberration
          offset={[0.0006, 0.0008]}
          radialModulation={false}
          modulationOffset={0}
          blendFunction={BlendFunction.NORMAL}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
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
      <Canvas camera={{ position: [0, 0, 4.6], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <Scene />
      </Canvas>
    </div>
  );
}
