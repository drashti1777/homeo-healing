"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { DoubleSide, Shape, type Group, type InstancedMesh, Object3D } from "three";

/** Flat leaf outline, extruded slightly so light catches the edges. */
function useLeafShape() {
  return useMemo(() => {
    const s = new Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.42, 0.28, 0.46, 0.92, 0, 1.45);
    s.bezierCurveTo(-0.46, 0.92, -0.42, 0.28, 0, 0);
    return s;
  }, []);
}

function Leaf({ y, angle, tilt, scale, color }: { y: number; angle: number; tilt: number; scale: number; color: string }) {
  const shape = useLeafShape();
  return (
    <group position={[0, y, 0]} rotation={[0, angle, 0]}>
      <mesh rotation={[tilt, 0, 0]} scale={scale}>
        <extrudeGeometry args={[shape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 24 }]} />
        <meshStandardMaterial color={color} roughness={0.5} side={DoubleSide} />
      </mesh>
    </group>
  );
}

/** Small "globule" pills drifting upward around the plant, like homoeopathic sugar pills. */
function Globules({ count = 26 }) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ r: 1.3 + ((i * 37) % 10) / 10, a: (i / count) * Math.PI * 2, y: ((i * 53) % 40) / 10 - 2, s: 0.04 + ((i * 17) % 5) / 100, v: 0.12 + ((i * 29) % 7) / 50 })),
    [count],
  );
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((p, i) => {
      const y = ((p.y + t * p.v + 2) % 4) - 2;
      dummy.position.set(Math.cos(p.a + t * 0.05) * p.r, y, Math.sin(p.a + t * 0.05) * p.r);
      dummy.scale.setScalar(p.s * (1 - Math.abs(y) / 2.4));
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#f4ecdc" roughness={0.3} />
    </instancedMesh>
  );
}

function Plant() {
  const group = useRef<Group>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * 0.12;
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
    g.rotation.x += (state.pointer.y * -0.18 - g.rotation.x) * 0.05;
    g.position.x += (state.pointer.x * 0.3 - g.position.x) * 0.04;
  });
  const leaves = [
    { y: -1.1, angle: 0, tilt: 1.0, scale: 0.85, color: "#376a4b" },
    { y: -0.75, angle: 2.2, tilt: 0.95, scale: 0.8, color: "#5e7d3c" },
    { y: -0.4, angle: 4.3, tilt: 0.9, scale: 0.75, color: "#285039" },
    { y: -0.05, angle: 1.1, tilt: 0.85, scale: 0.68, color: "#8fae67" },
    { y: 0.3, angle: 3.3, tilt: 0.8, scale: 0.6, color: "#376a4b" },
    { y: 0.62, angle: 5.4, tilt: 0.7, scale: 0.5, color: "#8fae67" },
  ];
  const petals = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  return (
    <group ref={group} position={[0, -0.1, 0]}>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 2.3, 12]} />
        <meshStandardMaterial color="#285039" roughness={0.6} />
      </mesh>
      {leaves.map((l, i) => <Leaf key={i} {...l} />)}
      <group position={[0, 0.95, 0]}>
        {petals.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.22, 0.05, Math.sin(a) * 0.22]} rotation={[Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9]} scale={[0.16, 0.34, 0.06]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color={i % 2 ? "#f4ecdc" : "#e9dcc0"} roughness={0.45} />
          </mesh>
        ))}
        <mesh scale={0.13}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial color="#c9a96b" roughness={0.35} metalness={0.15} />
        </mesh>
      </group>
      <Globules />
    </group>
  );
}

export default function HeroScene() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasWebgl = (() => {
      try {
        return !!document.createElement("canvas").getContext("webgl2");
      } catch {
        return false;
      }
    })();
    setEnabled(!reduce && hasWebgl);
  }, []);
  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.2, 4.6], fov: 40 }} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 4]} intensity={2.4} color="#fff6e6" />
        <directionalLight position={[-4, -1, -3]} intensity={0.6} color="#cddcb8" />
        <Plant />
      </Canvas>
    </div>
  );
}
