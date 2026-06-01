import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(Math.max(0, Math.min(1, window.scrollY / Math.max(1, h))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return p;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function Rings({ progress }: { progress: { current: number } }) {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const p = progress.current;
    if (!ringA.current || !ringB.current || !group.current) return;

    // Scene phases driven by scroll
    const splitT = smoothstep(0.1, 0.32, p); // rings split apart
    const formationT = smoothstep(0.32, 0.55, p); // form a diamond constellation
    const reuniteT = smoothstep(0.55, 0.78, p); // rings reunite, scale up
    const finaleT = smoothstep(0.78, 1.0, p);

    // Continuous rotation
    ringA.current.rotation.x += dt * 0.35;
    ringA.current.rotation.y += dt * 0.15;
    ringB.current.rotation.x += dt * 0.25;
    ringB.current.rotation.y -= dt * 0.4;

    // Split horizontally
    const offset = lerp(0, 2.2, splitT) - lerp(0, 1.4, formationT);
    ringA.current.position.x = -offset;
    ringB.current.position.x = offset;

    // Lift / tilt
    ringA.current.position.y = lerp(0, 0.6, formationT) - lerp(0, 0.4, reuniteT);
    ringB.current.position.y = -ringA.current.position.y;

    // Group transforms - camera-like dolly via group scale + rotation
    const targetScale = lerp(1, 1.45, reuniteT) * lerp(1, 0.85, finaleT);
    group.current.scale.setScalar(lerp(group.current.scale.x, targetScale, 0.08));

    const targetRotZ = lerp(0, Math.PI * 0.18, formationT) + lerp(0, -Math.PI * 0.08, finaleT);
    group.current.rotation.z = lerp(group.current.rotation.z, targetRotZ, 0.06);

    const targetRotY = lerp(0, Math.PI * 0.35, splitT) - lerp(0, Math.PI * 0.25, reuniteT);
    group.current.rotation.y = lerp(group.current.rotation.y, targetRotY, 0.06);

    // Subtle breathing
    const breath = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    group.current.position.y = breath + lerp(0, -0.3, finaleT);
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={ringA} castShadow>
          <torusGeometry args={[1.05, 0.11, 64, 220]} />
          <meshPhysicalMaterial
            color="#e8c278"
            metalness={1}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1.6}
          />
        </mesh>
        <mesh ref={ringB} castShadow rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.05, 0.11, 64, 220]} />
          <meshPhysicalMaterial
            color="#c9a04a"
            metalness={1}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.12}
            envMapIntensity={1.4}
          />
        </mesh>
      </Float>

      {/* Central gem */}
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh>
          <octahedronGeometry args={[0.32, 0]} />
          <MeshTransmissionMaterial
            thickness={0.6}
            roughness={0.05}
            transmission={1}
            ior={2.2}
            chromaticAberration={0.4}
            color="#f5ede0"
            attenuationColor="#7a2035"
            attenuationDistance={0.7}
            backside
          />
        </mesh>
      </Float>
    </group>
  );
}

function Constellation({ progress }: { progress: { current: number } }) {
  const grp = useRef<THREE.Group>(null);
  const items = Array.from({ length: 14 }).map((_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const r = 3.2 + (i % 3) * 0.4;
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.55, z: -1.5 + (i % 4) * 0.4 };
  });

  useFrame((state, dt) => {
    if (!grp.current) return;
    const p = progress.current;
    const v = smoothstep(0.3, 0.6, p);
    grp.current.rotation.z += dt * 0.05;
    grp.current.children.forEach((c, i) => {
      const target = v;
      (c as THREE.Mesh).scale.setScalar(lerp((c as THREE.Mesh).scale.x, target, 0.06));
      c.position.y = items[i].y + Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.08;
    });
  });

  return (
    <group ref={grp}>
      {items.map((it, i) => (
        <mesh key={i} position={[it.x, it.y, it.z]} scale={0}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshPhysicalMaterial
            color="#f5ede0"
            metalness={0.4}
            roughness={0.15}
            emissive="#c9a04a"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const progress = useRef(0);
  const p = useScrollProgress();
  progress.current = p;

  return (
    <>
      <color attach="background" args={["#09050a"]} />
      <fog attach="fog" args={["#09050a", 6, 16]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#e8c278" />
      <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#7a2035" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#f5ede0" />
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
        <Rings progress={progress} />
        <Constellation progress={progress} />
        <Sparkles count={80} scale={[10, 6, 4]} size={2.5} speed={0.25} color="#e8c278" opacity={0.6} />
      </Suspense>
    </>
  );
}

export function Scene3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
