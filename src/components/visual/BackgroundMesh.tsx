import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 15;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 15;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.05;
    ref.current.rotation.x = t * 0.02;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3B82F6"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export function BackgroundMesh() {
  return (
    <div className="fixed inset-0 z-[-2] bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
    </div>
  );
}
