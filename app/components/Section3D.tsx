'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Section3DProps {
  type?: 'mountain' | 'particles' | 'geometric' | 'waves';
  intensity?: number;
  color?: number;
}

function FloatingShape({ 
  type = 'geometric', 
  color = 0x548742, 
  position = [0, 0, 0],
  delay = 0 
}: { 
  type?: string; 
  color?: number;
  position?: [number, number, number];
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    switch (type) {
      case 'mountain':
        return new THREE.ConeGeometry(1, 2, 8);
      case 'geometric':
        return new THREE.OctahedronGeometry(0.8, 0);
      default:
        return new THREE.SphereGeometry(0.6, 16, 16);
    }
  }, [type]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.2}
        roughness={0.4}
      />
    </mesh>
  );
}

function ParticleField({ count = 100, color = 0x82b04f }: { count?: number; color?: number }) {
  const points = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 10;
      pos[i + 1] = (Math.random() - 0.5) * 10;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.6} />
    </points>
  );
}

export default function Section3D({ type = 'geometric', intensity = 1, color = 0x548742 }: Section3DProps) {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-60">
      <Canvas
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
          precision: 'highp',
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} color={color} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color={color} />
        
        {type === 'particles' ? (
          <ParticleField count={150} color={color} />
        ) : (
          <>
            <FloatingShape type={type} color={color} position={[0, 0, 0]} delay={0} />
            <FloatingShape type="geometric" color={color} position={[2, 1, -2]} delay={0.5} />
            <FloatingShape type="geometric" color={color} position={[-2, -1, -2]} delay={1} />
          </>
        )}
      </Canvas>
    </div>
  );
}

