import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from './theme-provider';

export default function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const [hovered, setHover] = useState(false);

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Gentle mouse follow
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, (state.pointer.x * state.viewport.width) / 10, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, (state.pointer.y * state.viewport.height) / 10, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <TorusKnot 
        ref={meshRef} 
        args={[1.2, 0.4, 128, 32]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.1 : 1}
      >
        <meshStandardMaterial
          color={isDark ? "#ffffff" : "#111111"}
          roughness={0.1}
          metalness={0.9}
        />
      </TorusKnot>
    </Float>
  );
}
