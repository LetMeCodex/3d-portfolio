import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Billboard, useTexture, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   Voxel Asset Component
   ───────────────────────────────────────────── */
interface VoxelAssetProps {
  url: string;
  position: [number, number, number];
  scale?: number;
  bobbing?: boolean;
  type?: 'animal' | 'plant';
  delay?: number;
}

function VoxelAsset({ url, position, scale = 1, bobbing = true, type = 'animal', delay = 0 }: VoxelAssetProps) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useTexture(url);
  texture.magFilter = THREE.NearestFilter;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() + delay;

    if (bobbing) {
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15;
    }

    if (type === 'plant') {
      meshRef.current.rotation.z = Math.sin(t * 1.2) * 0.08;
    } else {
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Billboard follow={true}>
        <mesh scale={scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={texture} 
            transparent 
            alphaTest={0.1} 
            side={THREE.DoubleSide} 
            depthWrite={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Floating Voxel Island
   ───────────────────────────────────────────── */
function FloatingIsland({ position, scale = 1, color = "#f0f0f0" }: { position: [number, number, number], scale?: number, color?: string }) {
  const group = useRef<THREE.Group>(null);
  const voxels = useMemo(() => {
    const parts = [];
    for (let i = 0; i < 5; i++) {
      parts.push({
        pos: [(Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.8],
        size: 0.4 + Math.random() * 0.4
      });
    }
    return parts;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
  });

  return (
    <group position={position} ref={group} scale={scale}>
      {voxels.map((v, i) => (
        <mesh key={i} position={v.pos as any}>
          <boxGeometry args={[v.size, v.size * 0.6, v.size]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Camera Rig
   ───────────────────────────────────────────── */
function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1, 10), 0.05);
    camera.lookAt(0, 0, 0);
  });
}

/* ─────────────────────────────────────────────
   Scene Interior (Suspended)
   ───────────────────────────────────────────── */
function Scene() {
  const personaTexture = useTexture('/persona-card.png');
  personaTexture.magFilter = THREE.LinearFilter;
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      // Gentle pulsing red light
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 1;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
      
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
      <pointLight ref={lightRef} position={[-8, 4, -5]} color="#ff0000" />

      {/* ── MASTERPIECE PERSONA CARD ── */}
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <group position={[0, 1.5, -15]}>
          <mesh scale={[32, 18, 1]}>
            <planeGeometry />
            <meshBasicMaterial 
              map={personaTexture} 
              transparent 
              opacity={0.8} 
              depthWrite={false}
            />
          </mesh>
          {/* Subtle Red Halo */}
          <mesh position={[0, 0, -0.2]} scale={[35, 20, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#ff4d4d" transparent opacity={0.04} />
          </mesh>
        </group>
      </Float>

      {/* ── FLOATING PARTICLES (MASTERPIECE DUST) ── */}
      <group>
        {[...Array(40)].map((_, i) => (
          <Float key={i} speed={0.5 + Math.random()} rotationIntensity={2} floatIntensity={2}>
            <mesh position={[(Math.random() - 0.5) * 25, (Math.random() - 0.5) * 20, -5]}>
              <boxGeometry args={[0.03, 0.03, 0.03]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#ff4d4d" : "#1a1a1a"} transparent opacity={0.4} />
            </mesh>
          </Float>
        ))}
      </group>

      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[-8, -1.5, 4]}>
          <FloatingIsland position={[0, -1.5, 0]} scale={1.5} color="#ffffff" />
          <VoxelAsset url="/pixel-art/turtle.png" position={[0, 0.2, 0]} scale={2.2} delay={0} />
          <VoxelAsset url="/pixel-art/grass-flowers.png" position={[-0.8, -0.4, 0.5]} scale={1.2} type="plant" delay={0.2} />
        </group>

        <group position={[8, 1.5, 4]}>
          <FloatingIsland position={[0, -1.5, 0]} scale={1.8} color="#ffffff" />
          <VoxelAsset url="/pixel-art/cat-frog.png" position={[0, 0.2, 0]} scale={2.5} delay={0.6} />
          <VoxelAsset url="/pixel-art/bee.png" position={[-1.2, 0.8, 0.5]} scale={0.8} delay={1.0} />
        </group>
      </Float>

      <ContactShadows 
        position={[0, -6, 0]} 
        opacity={0.05} 
        scale={30} 
        blur={4} 
        far={20} 
        color="#ff0000"
      />
      <Rig />
      
      <Environment preset="studio" />
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Export
   ───────────────────────────────────────────── */
export default function VoxelBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-white">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
