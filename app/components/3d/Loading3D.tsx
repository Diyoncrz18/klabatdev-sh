'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Komponen 3D untuk animasi loading
function LoadingSpinner() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const centerSphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.5;
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 1.2;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.8;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 1.0;
    }
    
    if (centerSphereRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      centerSphereRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Center sphere dengan glow */}
      <mesh ref={centerSphereRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={0x4a8b3a}
          emissive={0x2a5a2a}
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      
      {/* Ring 1 - Outer */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.8, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={0x3d7a2e}
          emissive={0x1a3a1a}
          emissiveIntensity={1.0}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      {/* Ring 2 - Middle */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.6, 0.04, 16, 100]} />
        <meshStandardMaterial
          color={0x4a8b3a}
          emissive={0x2a5a2a}
          emissiveIntensity={1.2}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      {/* Ring 3 - Inner */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[0.5, 0.03, 16, 100]} />
        <meshStandardMaterial
          color={0x5a9b4a}
          emissive={0x3a6a3a}
          emissiveIntensity={1.0}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      {/* Floating particles around */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 1.2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial
              color={0x4a8b3a}
              emissive={0x2a5a2a}
              emissiveIntensity={2.0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Komponen loading dengan overlay
export default function Loading3D({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Simulasi loading progress dengan variasi kecepatan
    let progressIncrement = 1.5;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Fade out setelah loading selesai
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
              setTimeout(onComplete, 500); // Wait for fade animation
            }
          }, 300);
          return 100;
        }
        // Variasi kecepatan untuk efek lebih natural
        const increment = progressIncrement + Math.random() * 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* 3D Loading Animation */}
        <div className="w-64 h-64 mb-8">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color={0x4a8b3a} />
            <pointLight position={[-5, -5, -5]} intensity={0.8} color={0x3d7a2e} />
            <directionalLight position={[0, 5, 0]} intensity={1.0} color={0xffffff} />
            <LoadingSpinner />
          </Canvas>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4 tracking-wider">
            KLABATDEV
          </h2>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  );
}

