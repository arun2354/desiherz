import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Component, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";

/** A lost/failed WebGL context should never take the rest of the page down with it. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (a: number, b: number, lambda: number, dt: number) => lerp(a, b, 1 - Math.exp(-lambda * dt));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const CAM_KEYS: { p: THREE.Vector3; l: THREE.Vector3 }[] = [
  { p: new THREE.Vector3(0, 0.1, 5.6), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(0.9, 0.3, 4.6), l: new THREE.Vector3(0, 0.05, 0) },
  { p: new THREE.Vector3(-0.4, 0.12, 3.5), l: new THREE.Vector3(0, 0, 0) },
  { p: new THREE.Vector3(0, 0.3, 4.1), l: new THREE.Vector3(0, 0.1, 0) },
  { p: new THREE.Vector3(0, 0.18, 4.8), l: new THREE.Vector3(0, 0, 0) },
];

function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
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
    camera.position.x = damp(camera.position.x, tp.x, 2.2, dt);
    camera.position.y = damp(camera.position.y, tp.y, 2.2, dt);
    camera.position.z = damp(camera.position.z, tp.z, 2.2, dt);
    look.current.x = damp(look.current.x, tl.x, 2.2, dt);
    look.current.y = damp(look.current.y, tl.y, 2.2, dt);
    look.current.z = damp(look.current.z, tl.z, 2.2, dt);
    camera.lookAt(look.current);
  });
  return null;
}

/** Two rings drift together, tilt to face the camera, and interlock. */
function Rings({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!group.current || !left.current || !right.current || !flash.current) return;
    const p = progress.current;
    const approach = smoothstep(0.06, 0.5, p);
    const interlock = smoothstep(0.48, 0.68, p);
    const settle = smoothstep(0.68, 0.92, p);
    const t = state.clock.elapsedTime;

    const startX = Math.min(2.3, Math.max(0.9, state.viewport.width * 0.4));
    const lx = lerp(-startX, -0.46, approach);
    const rx = lerp(startX, 0.46, approach);
    left.current.position.x = damp(left.current.position.x, lx, 3, dt);
    right.current.position.x = damp(right.current.position.x, rx, 3, dt);

    const lz = lerp(0, 0.24, interlock);
    const rz = lerp(0, -0.24, interlock);
    left.current.position.z = damp(left.current.position.z, lz, 3, dt);
    right.current.position.z = damp(right.current.position.z, rz, 3, dt);

    left.current.rotation.y = damp(left.current.rotation.y, lerp(-0.9, -0.18, approach), 2.4, dt);
    right.current.rotation.y = damp(right.current.rotation.y, lerp(0.9, 0.18, approach), 2.4, dt);
    left.current.rotation.x = Math.sin(t * 0.5) * 0.04;
    right.current.rotation.x = Math.sin(t * 0.5 + 1) * 0.04;

    const flashScale = lerp(0, 1, interlock) * lerp(1, 0.5, settle);
    flash.current.scale.setScalar(damp(flash.current.scale.x, flashScale, 3.2, dt));
    const flashMat = flash.current.material as THREE.MeshBasicMaterial;
    flashMat.opacity = damp(flashMat.opacity, lerp(0, 0.4, smoothstep(0.5, 0.62, p)) * (1 - smoothstep(0.85, 1, p) * 0.6), 3, dt);

    group.current.rotation.y = damp(group.current.rotation.y, lerp(0, 0.35, settle), 1.6, dt);
    group.current.position.y = Math.sin(t * 0.4) * 0.045 + lerp(0, -0.08, settle);
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.3}>
        <mesh ref={left} position={[-2.5, 0, 0]} rotation={[Math.PI / 2, -0.9, 0]}>
          <torusGeometry args={[0.68, 0.1, 32, 96]} />
          <meshPhysicalMaterial
            color="#c9a35d"
            metalness={0.92}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#5c4213"
            emissiveIntensity={0.22}
            envMapIntensity={1.9}
          />
        </mesh>
        <mesh ref={right} position={[2.5, 0, 0]} rotation={[Math.PI / 2, 0.9, 0]}>
          <torusGeometry args={[0.68, 0.1, 32, 96]} />
          <meshPhysicalMaterial
            color="#e6c98a"
            metalness={0.92}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.06}
            emissive="#3d0c18"
            emissiveIntensity={0.2}
            envMapIntensity={2}
          />
        </mesh>
      </Float>

      <mesh ref={flash}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#f5ede0" transparent opacity={0} />
      </mesh>
    </group>
  );
}

function Scene({ progress }: { progress: MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#0a0908"]} />
      <fog attach="fog" args={["#0a0908", 6.5, 18]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} color="#e6c98a" />
      <directionalLight position={[-5, -2, 3]} intensity={0.6} color="#4a141f" />
      <pointLight position={[0, 0, 3]} intensity={1.1} color="#f5ede0" />
      <CameraRig progress={progress} />
      <Rings progress={progress} />
      <Sparkles count={70} scale={[13, 7, 6]} size={2.2} speed={0.22} color="#e6c98a" opacity={0.45} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.75} luminanceThreshold={0.58} luminanceSmoothing={0.35} />
        <Vignette eskil={false} offset={0.2} darkness={0.72} />
      </EffectComposer>
    </>
  );
}

/** Persistent scroll-driven scene: pass a ref whose .current is scroll progress in [0,1]. */
export function Scene3D({ progress }: { progress: MutableRefObject<number> }) {
  const camera = useMemo(() => ({ position: [0, 0.1, 5.6] as [number, number, number], fov: 38 }), []);
  return (
    <SceneBoundary>
      <Canvas
        camera={camera}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "default" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
        }}
      >
        <Scene progress={progress} />
      </Canvas>
    </SceneBoundary>
  );
}
