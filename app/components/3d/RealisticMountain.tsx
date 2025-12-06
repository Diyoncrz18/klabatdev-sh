'use client';

import { useRef, useMemo, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// Dark Color Palette (hitam seperti awal)
const colors = {
  dark1: '#0E0E0E',
  dark2: '#08230D',
  sunlight: 0xffffff, // Putih untuk cahaya matahari
  warmLight: 0xfff5e6, // Kuning lembut
  coolBlue: 0x87ceeb,
  snowWhite: 0xffffff,
  rockGray: 0x4a4a4a,
  rockBrown: 0x5d4e37,
  fogColor: 0x0a0a0a, // Hitam untuk fog
  fogGray: 0x1a1a1a,
};

// Procedural Noise Function untuk Heightmap
function generateNoise(width: number, height: number, scale: number = 1): Float32Array {
  const data = new Float32Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Multi-octave Perlin-like noise
      let value = 0;
      let amplitude = 1;
      let frequency = 0.01 * scale;
      
      for (let i = 0; i < 6; i++) {
        const nx = x * frequency;
        const ny = y * frequency;
        
        // Simplex noise approximation
        const n1 = Math.sin(nx * 0.1) * Math.cos(ny * 0.1);
        const n2 = Math.sin(nx * 0.2 + ny * 0.1) * Math.cos(ny * 0.2);
        const n3 = Math.sin(nx * 0.4 + ny * 0.2) * Math.cos(ny * 0.4);
        const n4 = Math.sin(nx * 0.8 + ny * 0.4) * Math.cos(ny * 0.8);
        
        value += (n1 * 0.5 + n2 * 0.25 + n3 * 0.125 + n4 * 0.0625) * amplitude;
        
        amplitude *= 0.5;
        frequency *= 2;
      }
      
      // Normalize to 0-1 range
      value = (value + 1) * 0.5;
      
      // Create mountain shape (higher in center, lower at edges)
      const centerX = width / 2;
      const centerY = height / 2;
      const distFromCenter = Math.sqrt(
        Math.pow((x - centerX) / centerX, 2) + 
        Math.pow((y - centerY) / centerY, 2)
      );
      const mountainShape = Math.max(0, 1 - distFromCenter * 1.2);
      
      // Combine noise with mountain shape
      data[y * width + x] = value * mountainShape;
    }
  }
  
  return data;
}

// Custom Shader Material untuk Puncak Bersalju dan Lereng Berbatu
const mountainShader = {
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vHeight;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vHeight = position.y;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 rockColor;
    uniform vec3 snowColor;
    uniform float snowHeight;
    uniform float slopeThreshold;
    uniform float time;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vHeight;
    
    // Multi-octave noise for realistic texture detail
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      // Calculate slope (steepness) - more accurate
      float slope = acos(dot(vNormal, vec3(0.0, 1.0, 0.0))) / 1.5708; // 0 to 1
      
      // Normalize height for calculations (0 to 1) - disesuaikan untuk cone yang SANGAT BESAR
      float normalizedHeight = (vHeight + 11.0) / 22.0; // Adjust untuk cone geometry yang SANGAT BESAR
      
      // Ultra-realistic multi-scale rock texture dengan banyak detail
      vec2 rockUV = vUv * 15.0;
      
      // Multiple octaves untuk detail yang sangat halus
      float rockDetail1 = fbm(rockUV); // Large scale
      float rockDetail2 = fbm(rockUV * 4.0); // Medium scale
      float rockDetail3 = fbm(rockUV * 12.0); // Small scale
      float rockDetail4 = fbm(rockUV * 35.0); // Fine detail
      float rockDetail5 = fbm(rockUV * 80.0); // Very fine detail
      
      // Combine rock details dengan weighting yang lebih baik
      float rockVariation = rockDetail1 * 0.35 + rockDetail2 * 0.25 + rockDetail3 * 0.2 + 
                           rockDetail4 * 0.12 + rockDetail5 * 0.08;
      
      // Enhanced crack/crevice detail dengan multiple scales
      float cracks1 = fbm(vUv * 30.0);
      float cracks2 = fbm(vUv * 60.0);
      float cracks = (cracks1 * 0.6 + cracks2 * 0.4);
      rockVariation = mix(rockVariation, rockVariation * 0.65, smoothstep(0.55, 0.85, cracks));
      
      // Add rock surface roughness detail
      float roughness = fbm(vUv * 50.0 + time * 0.01);
      rockVariation += (roughness - 0.5) * 0.15;
      
      // Ultra-realistic rock color dengan banyak variasi hijau alam
      vec3 darkRock = rockColor * 0.6; // Hijau gelap (hutan dalam)
      vec3 midRock = rockColor * 0.9; // Hijau medium (hutan normal)
      vec3 lightRock = rockColor * 1.3; // Hijau terang (rumput/vegetasi)
      vec3 veryLightRock = rockColor * 1.6; // Hijau sangat terang (daun muda)
      
      // Multi-layer rock color mixing dengan smooth transitions
      vec3 rock = mix(darkRock, midRock, smoothstep(0.2, 0.5, rockVariation));
      rock = mix(rock, lightRock, smoothstep(0.5, 0.8, rockVariation));
      rock = mix(rock, veryLightRock, smoothstep(0.8, 1.0, rockVariation));
      
      // Add moss/vegetation color variation dengan warna hijau yang lebih realistis
      float mossFactor = fbm(vUv * 8.0 + time * 0.005);
      vec3 mossColor = vec3(0.15, 0.55, 0.12); // Hijau lumut yang lebih natural
      vec3 grassColor = vec3(0.25, 0.65, 0.18); // Hijau rumput
      vec3 forestColor = vec3(0.12, 0.45, 0.10); // Hijau hutan gelap
      
      // Mix berdasarkan faktor moss dan slope
      float mossMix = smoothstep(0.4, 0.7, mossFactor) * (1.0 - smoothstep(0.3, 0.6, slope));
      rock = mix(rock, mix(rock, mossColor, 0.4), mossMix * 0.6);
      
      // Tambahkan variasi hijau rumput di area yang lebih datar
      float grassMix = (1.0 - slope) * smoothstep(0.3, 0.5, normalizedHeight) * 
                       (1.0 - smoothstep(0.5, 0.7, normalizedHeight));
      rock = mix(rock, mix(rock, grassColor, 0.3), grassMix);
      
      // Tambahkan warna hutan gelap di area yang lebih rendah
      float forestMix = (1.0 - normalizedHeight) * smoothstep(0.0, 0.3, normalizedHeight);
      rock = mix(rock, mix(rock, forestColor, 0.25), forestMix);
      
      // Enhanced color variation based on height dengan banyak nuance
      float baseDarkness = smoothstep(0.0, 0.2, normalizedHeight);
      float lowerMid = smoothstep(0.2, 0.4, normalizedHeight);
      float midBrightness = smoothstep(0.4, 0.6, normalizedHeight) * 
                          (1.0 - smoothstep(0.6, 0.75, normalizedHeight));
      float topDarkness = smoothstep(0.75, 1.0, normalizedHeight);
      
      rock = mix(rock * 0.8, rock, baseDarkness);
      rock = mix(rock, rock * 1.05, lowerMid);
      rock = mix(rock, rock * 1.2, midBrightness); // Lebih terang di tengah
      rock = mix(rock, rock * 0.85, topDarkness);
      
      // Add subtle color tint berdasarkan exposure (sun-facing) dengan lebih banyak detail
      float sunExposure = dot(vNormal, normalize(vec3(0.5, 1.0, 0.3)));
      vec3 sunTint = vec3(0.05, 0.12, 0.03); // Tint hijau terang untuk highlight matahari
      rock += sunTint * max(0.0, sunExposure) * (1.0 + rockVariation * 0.4);
      
      // Add shadow areas dengan warna lebih gelap
      float shadowFactor = max(0.0, -dot(vNormal, normalize(vec3(0.5, 1.0, 0.3))));
      rock *= (1.0 - shadowFactor * 0.25);
      
      // Add subtle color variation berdasarkan slope (lereng curam lebih gelap)
      rock *= (0.9 + (1.0 - slope) * 0.1);
      
      // Ultra-realistic snow distribution dengan detail maksimal
      float snowFactor = 0.0;
      
      // Snow based on height dengan transition yang sangat smooth
      float heightSnow = smoothstep(snowHeight - 0.2, snowHeight + 0.3, normalizedHeight);
      
      // Enhanced slope calculation untuk snow accumulation yang realistis
      float slopeSnow = 1.0 - smoothstep(0.0, slopeThreshold, slope);
      // Snow accumulates better on gentler slopes dengan curve yang lebih natural
      slopeSnow = pow(slopeSnow, 1.8);
      
      // Wind exposure factor (less snow on windward side) dengan detail
      float windExposure = dot(vNormal, normalize(vec3(0.8, 0.2, 0.5)));
      float windFactor = 0.8 + max(0.0, windExposure) * 0.2;
      
      // Temperature variation (less snow in warmer areas)
      float tempVariation = fbm(vUv * 5.0);
      float tempFactor = 0.9 + tempVariation * 0.1;
      
      // Combine all factors
      snowFactor = heightSnow * slopeSnow * windFactor * tempFactor;
      
      // Ultra-enhanced snow noise untuk distribusi yang sangat natural
      float snowNoise1 = fbm(vUv * 18.0 + time * 0.003);
      float snowNoise2 = fbm(vUv * 40.0 + time * 0.006);
      float snowNoise3 = fbm(vUv * 80.0 + time * 0.01);
      float snowNoise = (snowNoise1 * 0.5 + snowNoise2 * 0.3 + snowNoise3 * 0.2);
      snowFactor *= (0.6 + snowNoise * 0.4);
      
      // Snow color dengan variasi yang sangat realistis
      vec3 snow = snowColor;
      
      // Multiple scales untuk variasi salju
      float snowVariation1 = fbm(vUv * 30.0);
      float snowVariation2 = fbm(vUv * 60.0);
      float snowVariation3 = fbm(vUv * 120.0);
      float snowVariation = (snowVariation1 * 0.5 + snowVariation2 * 0.3 + snowVariation3 * 0.2) * 0.15;
      
      // Slight blue tint untuk salju di shadow areas dengan gradasi
      float shadowAmount = max(0.0, -dot(vNormal, normalize(vec3(0.5, 1.0, 0.3))));
      vec3 shadowSnow = mix(snow, vec3(0.88, 0.91, 0.94), 0.4);
      snow = mix(snow, shadowSnow, shadowAmount);
      
      // Add slight yellow tint untuk salju di area yang terkena sinar matahari
      vec3 sunSnow = mix(snow, vec3(1.0, 0.98, 0.95), 0.2);
      float sunAmount = max(0.0, dot(vNormal, normalize(vec3(0.5, 1.0, 0.3))));
      snow = mix(snow, sunSnow, sunAmount * 0.5);
      
      // Apply snow variation
      snow = mix(snow, snow * (1.0 - snowVariation), 0.6);
      
      // Add subtle depth to snow dengan slight color variation
      snow += vec3(0.02, 0.02, 0.03) * snowVariation;
      
      // Ultra-realistic mixing dengan transition yang sangat natural
      float snowMix = smoothstep(0.2, 0.8, snowFactor);
      
      // Add transition zone dengan campuran rock dan snow
      float transitionZone = smoothstep(0.15, 0.25, snowFactor) * (1.0 - smoothstep(0.75, 0.85, snowFactor));
      vec3 transitionColor = mix(rock, snow, 0.3);
      vec3 baseColor = mix(rock, transitionColor, transitionZone * 0.4);
      vec3 finalColor = mix(baseColor, snow, snowMix);
      
      // Enhanced rim lighting dengan color variation yang lebih detail
      float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
      rim = pow(rim, 1.6);
      vec3 rimColor = mix(vec3(1.0, 0.95, 0.9), vec3(0.9, 0.95, 1.0), snowMix);
      finalColor += rim * rimColor * 0.15;
      
      // Enhanced specular highlight untuk salju dengan lebih banyak detail
      float specular = pow(max(0.0, dot(vNormal, normalize(vec3(0.5, 1.0, 0.3)))), 50.0);
      finalColor += snow * specular * snowMix * 0.3;
      
      // Add subtle subsurface scattering untuk salju
      float sss = pow(max(0.0, dot(vNormal, normalize(vec3(-0.3, 1.0, -0.2)))), 8.0);
      finalColor += snow * sss * snowMix * 0.15;
      
      // Add glow effect untuk puncak bersalju
      float peakGlow = smoothstep(0.7, 1.0, normalizedHeight) * snowMix;
      finalColor += vec3(0.1, 0.1, 0.15) * peakGlow;
      
      // Enhanced atmospheric perspective dengan color shift yang lebih halus
      float distanceFade = 1.0 - smoothstep(0.0, 1.0, length(vPosition) / 15.0);
      vec3 atmosphericTint = vec3(0.87, 0.89, 0.93);
      finalColor = mix(finalColor * atmosphericTint, finalColor, distanceFade);
      
      // Enhanced color grading untuk cinematic look dengan lebih banyak nuance
      finalColor = pow(finalColor, vec3(0.92)); // Slight gamma adjustment
      
      // Add subtle color saturation boost
      float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
      finalColor = mix(vec3(luminance), finalColor, 1.1);
      
      // Final contrast adjustment
      finalColor = (finalColor - 0.5) * 1.05 + 0.5;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  uniforms: {
    rockColor: { value: new THREE.Color(colors.rockBrown) },
    snowColor: { value: new THREE.Color(colors.snowWhite) },
    snowHeight: { value: 0.6 },
    slopeThreshold: { value: 0.7 },
  },
};

// Realistic Mountain Component
function RealisticMountain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const displacementMapRef = useRef<THREE.DataTexture | null>(null);
  
  // Enhanced animations dengan rotasi yang jelas dan smooth
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotasi yang jelas dan smooth - lebih lambat untuk efek yang lebih natural
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15; // Rotasi kontinyu yang smooth
    }
    
    // Update time uniform untuk animasi shader
    if (materialRef.current?.uniforms?.time) {
      materialRef.current.uniforms.time.value = time;
    }
  });
  
  // Create cone geometry dengan displacement yang lebih realistis dan tidak simetris
  const geometry = useMemo(() => {
    const radius = 18; // Radius dasar
    const height = 22; // Tinggi gunung
    const radialSegments = 96; // Ditingkatkan untuk detail lebih halus
    const heightSegments = 48; // Ditingkatkan untuk detail lebih halus
    
    // Buat kerucut (cone) sebagai base
    const cone = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments);
    
    // Tambahkan detail permukaan dengan displacement yang lebih kompleks dan realistis
    const positions = cone.attributes.position;
    const normals = cone.attributes.normal;
    
    // Multi-octave noise function untuk displacement yang lebih natural
    const noise = (x: number, y: number, z: number) => {
      let value = 0;
      let amplitude = 1;
      let frequency = 0.1;
      
      for (let i = 0; i < 5; i++) {
        value += Math.sin(x * frequency + y * frequency * 2) * 
                 Math.cos(z * frequency + y * frequency * 1.5) * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      return value;
    };
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Untuk puncak (y = height/2), pastikan x dan z = 0 dengan sedikit variasi
      if (Math.abs(y - height / 2) < 0.1) {
        const peakVariation = noise(x * 0.5, y * 0.5, z * 0.5) * 0.1;
        positions.setX(i, peakVariation);
        positions.setZ(i, peakVariation * 0.8);
      } else {
        // Tambahkan detail permukaan yang lebih kompleks dan tidak simetris
        const distance = Math.sqrt(x * x + z * z);
        
        if (distance > 0.001 && isFinite(distance)) {
          const normalizedY = (y + height / 2) / height;
          const angle = Math.atan2(z, x);
          
          // Multi-scale displacement untuk bentuk yang lebih natural
          const largeScale = noise(angle * 2, normalizedY * 3, 0) * 0.3;
          const mediumScale = noise(angle * 6, normalizedY * 8, distance * 0.2) * 0.15;
          const smallScale = noise(angle * 12, normalizedY * 15, distance * 0.4) * 0.08;
          
          // Asymmetrical displacement untuk bentuk yang lebih realistis
          const asymmetry = Math.sin(angle * 3 + normalizedY * 5) * 0.2;
          
          // Combine all displacements
          const totalDisplacement = (largeScale + mediumScale + smallScale + asymmetry) * 
                                    (1 - normalizedY * 0.5); // Kurangi displacement di puncak
          
          // Terapkan displacement secara radial
          const newX = x + (x / distance) * totalDisplacement;
          const newZ = z + (z / distance) * totalDisplacement;
          
          // Tambahkan sedikit variasi vertikal untuk detail lereng
          const verticalVariation = noise(x * 0.3, z * 0.3, normalizedY * 2) * 0.05;
          const newY = y + verticalVariation * (1 - normalizedY);
          
          // Pastikan nilai tidak NaN atau Infinity
          if (isFinite(newX) && isFinite(newZ) && isFinite(newY)) {
            positions.setX(i, newX);
            positions.setY(i, newY);
            positions.setZ(i, newZ);
          }
        }
      }
    }
    
    positions.needsUpdate = true;
    
    // Validasi geometry untuk memastikan tidak ada NaN
    const posArray = positions.array as Float32Array;
    for (let i = 0; i < posArray.length; i++) {
      if (!isFinite(posArray[i]) || isNaN(posArray[i])) {
        const index = i % 3;
        if (index === 0) posArray[i] = 0; // x
        else if (index === 1) posArray[i] = -height / 2; // y
        else posArray[i] = 0; // z
      }
    }
    positions.needsUpdate = true;
    
    // Recompute normals dan tangents untuk lighting yang benar
    cone.computeVertexNormals();
    cone.computeTangents();
    
    // Validasi bounding sphere
    if (cone.boundingSphere === null || !isFinite(cone.boundingSphere.radius)) {
      cone.computeBoundingSphere();
    }
    
    return cone;
  }, []);
  
  // Create material with custom shader - enhanced for realism dengan warna hijau
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: mountainShader.vertexShader,
      fragmentShader: mountainShader.fragmentShader,
      uniforms: {
        rockColor: { value: new THREE.Color(0x3d7a2e) }, // Warna hijau alam yang lebih realistis
        snowColor: { value: new THREE.Color(0xffffff) }, // Salju putih terang untuk kontras lebih baik
        snowHeight: { value: 0.65 }, // Snow line yang lebih realistis
        slopeThreshold: { value: 0.65 }, // Threshold untuk salju di lereng
        time: { value: 0 }, // Untuk animasi
      },
      side: THREE.FrontSide,
    });
    materialRef.current = mat;
    return mat;
  }, []);
  
  
  return (
    <group ref={groupRef} position={[0, -11, 0]}>
      {/* Main mountain mesh */}
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
      
      {/* Additional glow layer untuk efek visual - lebih subtle */}
      <mesh geometry={geometry} scale={1.01}>
        <meshBasicMaterial
          color={0x3d7a2e}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Front glow layer untuk visibility - lebih subtle */}
      <mesh geometry={geometry} scale={1.005}>
        <meshBasicMaterial
          color={0x4a8b3a}
          transparent
          opacity={0.2}
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Snow glow effect di puncak - EKSTREM TERANG */}
      <mesh geometry={geometry} scale={1.015}>
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={1.0}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Golden Hour Lighting Setup dengan animasi
function GoldenHourLighting() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  
  // TIDAK ADA ANIMASI LIGHTING - STABIL UNTUK MENCEGAH FLICKERING
  // useFrame dihapus untuk mencegah perubahan intensity yang menyebabkan flickering
  
  return (
    <>
      {/* Main directional light (natural sunlight) - STABIL, TIDAK ADA ANIMASI */}
      <directionalLight
        ref={directionalLightRef}
        position={[-10, 5, -10]}
        intensity={12.0} // TETAP, tidak pernah berubah
        color={colors.sunlight}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />
      
      {/* Cool blue ambient light for fill - STABIL, TIDAK ADA ANIMASI */}
      <ambientLight ref={ambientLightRef} intensity={2.5} color={colors.coolBlue} />
      
      {/* Additional fill light - STABIL, TIDAK ADA ANIMASI */}
      <directionalLight
        ref={fillLightRef}
        position={[5, 2, 5]}
        intensity={4.0} // TETAP, tidak pernah berubah
        color={colors.warmLight}
      />
      
      {/* Rim light untuk visibility - STABIL, TIDAK ADA ANIMASI */}
      <directionalLight
        ref={rimLightRef}
        position={[10, 3, 10]}
        intensity={5.0} // TETAP, tidak pernah berubah
        color={colors.sunlight}
      />
      
      {/* Top light untuk highlight puncak - STABIL, TIDAK ADA ANIMASI */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={3.5} // TETAP, tidak pernah berubah
        color={colors.sunlight}
      />
      
      {/* Additional accent lights untuk detail - STABIL, TIDAK ADA ANIMASI */}
      <pointLight
        position={[0, 8, 0]}
        intensity={6.0} // TETAP, tidak pernah berubah
        color={colors.sunlight}
        distance={50}
        decay={1.5}
      />
      <pointLight
        position={[-8, 3, -8]}
        intensity={4.0} // TETAP, tidak pernah berubah
        color={colors.warmLight}
        distance={40}
        decay={1.5}
      />
      <pointLight
        position={[8, 3, 8]}
        intensity={4.0} // TETAP, tidak pernah berubah
        color={colors.warmLight}
        distance={40}
        decay={1.5}
      />
    </>
  );
}

// Skybox/Gradient Background hitam
function Skybox() {
  const skyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 color = mix(bottomColor, topColor, h * 0.5 + 0.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        topColor: { value: new THREE.Color(0x0E0E0E) }, // Hitam gelap
        bottomColor: { value: new THREE.Color(0x08230D) }, // Hitam kehijauan gelap
      },
      side: THREE.BackSide,
    });
  }, []);
  
  return (
    <mesh position={[0, 0, 0]} material={skyMaterial}>
      <sphereGeometry args={[50, 32, 32]} />
    </mesh>
  );
}

// Static Fog - TIDAK ADA ANIMASI untuk mencegah flickering
function AnimatedFog() {
  const { scene } = useThree();
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const initialized = useRef(false);
  
  // Initialize fog sekali saja - TIDAK PERNAH DIUBAH - TIDAK ADA ANIMASI
  useEffect(() => {
    if (!initialized.current && !fogRef.current) {
      fogRef.current = new THREE.FogExp2(colors.fogColor, 0.015);
      scene.fog = fogRef.current;
      initialized.current = true;
    }
    // TIDAK cleanup untuk mencegah flickering
  }, [scene]);
  
  // TIDAK ADA useFrame - fog density TIDAK PERNAH BERUBAH untuk mencegah flickering
  
  return null; // Fog sudah di-set via useEffect
}

// Floating Particles untuk atmosfer
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      // Distribute particles around mountain
      const radius = 8 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const height = -2 + Math.random() * 8;
      
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = height;
      positions[i + 2] = Math.sin(angle) * radius;
      
      // White/light gray colors
      const intensity = 0.3 + Math.random() * 0.4;
      colors[i] = intensity;
      colors[i + 1] = intensity;
      colors[i + 2] = intensity;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current?.geometry) {
      const time = state.clock.elapsedTime;
      const positions = pointsRef.current.geometry.attributes.position;
      
      if (positions?.array) {
        const arr = positions.array as Float32Array;
        for (let i = 1; i < arr.length; i += 3) {
          // Slow upward drift
          arr[i] += 0.002 + Math.sin(time * 0.5 + i) * 0.001;
          if (arr[i] > 10) arr[i] = -2;
          
          // Gentle horizontal drift
          const swirl = time * 0.2 + i * 0.01;
          arr[i - 1] += Math.sin(swirl) * 0.0005;
          arr[i + 1] += Math.cos(swirl) * 0.0005;
        }
        positions.needsUpdate = true;
      }
    }
  });
  
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(particles.positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(particles.colors, 3));
    return geom;
  }, [particles]);
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Realistic Disk Component dengan rotasi dan detail yang lebih baik
function RealisticDisk() {
  const diskGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groundRef = useRef<THREE.Mesh>(null);
  
  // Rotasi piringan yang smooth
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (diskGroupRef.current) {
      // Rotasi piringan dengan kecepatan yang natural
      diskGroupRef.current.rotation.y = time * 0.1; // Rotasi lambat dan smooth
    }
    
    // Update time untuk shader animasi
    if (ringRef.current && ringRef.current.material instanceof THREE.ShaderMaterial) {
      if (ringRef.current.material.uniforms?.time) {
        ringRef.current.material.uniforms.time.value = time;
      }
    }
  });
  
  // Shader untuk piringan yang lebih realistis
  const diskShader = useMemo(() => ({
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      uniform vec3 edgeColor;
      
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      // Noise function untuk detail
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      void main() {
        // Calculate distance from center untuk efek radial
        float dist = length(vUv - vec2(0.5, 0.5));
        
        // Detail texture dengan noise
        vec2 detailUV = vUv * 8.0;
        float detail1 = fbm(detailUV);
        float detail2 = fbm(detailUV * 3.0);
        float detail3 = fbm(detailUV * 9.0);
        float textureDetail = detail1 * 0.5 + detail2 * 0.3 + detail3 * 0.2;
        
        // Warna dasar dengan variasi
        vec3 color = baseColor;
        
        // Tambahkan variasi warna berdasarkan texture
        color = mix(color * 0.85, color * 1.15, textureDetail);
        
        // Efek edge yang lebih terang (untuk ring)
        float edgeFactor = smoothstep(0.85, 1.0, dist);
        color = mix(color, edgeColor, edgeFactor * 0.4);
        
        // Tambahkan efek radial gradient
        float radialGradient = 1.0 - smoothstep(0.3, 0.9, dist);
        color *= (0.7 + radialGradient * 0.3);
        
        // Tambahkan highlight berdasarkan normal
        float highlight = pow(max(0.0, dot(vNormal, normalize(vec3(0.5, 1.0, 0.3)))), 2.0);
        color += vec3(0.1, 0.1, 0.1) * highlight;
        
        // Tambahkan shadow areas
        float shadow = max(0.0, -dot(vNormal, normalize(vec3(0.5, 1.0, 0.3))));
        color *= (1.0 - shadow * 0.2);
        
        // Tambahkan efek metalik subtle
        float metallic = 0.3;
        vec3 metallicColor = mix(color, vec3(0.8, 0.85, 0.9), metallic * highlight);
        color = mix(color, metallicColor, 0.2);
        
        // Final color adjustment
        color = pow(color, vec3(0.95)); // Gamma correction
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color(0x2a3a2a) }, // Hijau gelap untuk piringan
      edgeColor: { value: new THREE.Color(0x4a6b4a) }, // Hijau terang untuk edge
    },
  }), []);
  
  // Geometry untuk ground plane dengan detail lebih tinggi
  const groundGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(100, 100, 64, 64);
    const positions = geom.attributes.position;
    
    // Tambahkan sedikit displacement untuk detail
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const distance = Math.sqrt(x * x + z * z);
      
      // Displacement halus berdasarkan jarak dari center
      const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.02;
      const radialDisplacement = Math.sin(distance * 0.05) * 0.01;
      
      positions.setY(i, noise + radialDisplacement);
    }
    
    positions.needsUpdate = true;
    geom.computeVertexNormals();
    
    return geom;
  }, []);
  
  // Material untuk ground
  const groundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x1a2a1a, // Hijau gelap
      roughness: 0.8,
      metalness: 0.1,
      emissive: 0x0a1a0a,
      emissiveIntensity: 0.2,
    });
  }, []);
  
  // Material untuk ring dengan shader
  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: diskShader.vertexShader,
      fragmentShader: diskShader.fragmentShader,
      uniforms: diskShader.uniforms,
      side: THREE.DoubleSide,
    });
  }, [diskShader]);
  
  return (
    <group ref={diskGroupRef} position={[0, -11, 0]}>
      {/* Ground plane dengan detail */}
      <mesh 
        ref={groundRef}
        geometry={groundGeometry} 
        rotation={[-Math.PI / 2, 0, 0]} 
        material={groundMaterial}
        receiveShadow
      />
      
      {/* Ring piringan dengan shader realistis */}
      <mesh 
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.05, 0]}
        material={ringMaterial}
      >
        <ringGeometry args={[17, 19, 128, 1]} />
      </mesh>
      
      {/* Inner ring detail */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.03, 0]}
      >
        <ringGeometry args={[16.5, 17, 96, 1]} />
        <meshStandardMaterial 
          color={0x3a4a3a}
          roughness={0.6}
          metalness={0.4}
          emissive={0x1a2a1a}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer edge highlight */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.06, 0]}
      >
        <ringGeometry args={[18.8, 19, 128, 1]} />
        <meshStandardMaterial 
          color={0x5a7a5a}
          roughness={0.4}
          metalness={0.5}
          emissive={0x2a3a2a}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Partikel bulat yang memancar dari piringan
function DiskParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleDataRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    life: number;
    maxLife: number;
  }>>([]);
  
  const particles = useMemo(() => {
    const count = 200; // Jumlah partikel
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Inisialisasi partikel data
    const data: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
    }> = [];
    
    for (let i = 0; i < count; i++) {
      // Posisi awal di piringan (dalam radius 14-16)
      const angle = Math.random() * Math.PI * 2;
      const radius = 14 + Math.random() * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -9; // Di level piringan
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Velocity - memancar ke atas dan keluar
      const speed = 0.05 + Math.random() * 0.1;
      const verticalSpeed = 0.08 + Math.random() * 0.12;
      const vx = Math.cos(angle) * speed * (0.5 + Math.random() * 0.5);
      const vz = Math.sin(angle) * speed * (0.5 + Math.random() * 0.5);
      const vy = verticalSpeed;
      
      // Warna hijau dengan variasi
      const greenIntensity = 0.4 + Math.random() * 0.6;
      colors[i * 3] = 0.1 * greenIntensity; // R
      colors[i * 3 + 1] = greenIntensity; // G - hijau
      colors[i * 3 + 2] = 0.2 * greenIntensity; // B
      
      // Ukuran partikel - diperbesar
      sizes[i] = 0.15 + Math.random() * 0.18;
      
      // Simpan data partikel
      data.push({
        x, y, z,
        vx, vy, vz,
        life: 0,
        maxLife: 3 + Math.random() * 4, // Life span 3-7 detik
      });
    }
    
    particleDataRef.current = data;
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state, delta) => {
    if (particlesRef.current?.geometry && particleDataRef.current.length > 0) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position;
      const colors = particlesRef.current.geometry.attributes.color;
      
      if (positions?.array && colors?.array) {
        const posArr = positions.array as Float32Array;
        const colArr = colors.array as Float32Array;
        
        for (let i = 0; i < particleDataRef.current.length; i++) {
          const particle = particleDataRef.current[i];
          
          // Update life
          particle.life += delta;
          
          // Reset partikel jika sudah mati atau terlalu tinggi
          if (particle.life > particle.maxLife || particle.y > 5) {
            // Reset ke piringan
            const angle = Math.random() * Math.PI * 2;
            const radius = 14 + Math.random() * 2;
            particle.x = Math.cos(angle) * radius;
            particle.z = Math.sin(angle) * radius;
            particle.y = -9;
            
            // Reset velocity
            const speed = 0.05 + Math.random() * 0.1;
            const verticalSpeed = 0.08 + Math.random() * 0.12;
            particle.vx = Math.cos(angle) * speed * (0.5 + Math.random() * 0.5);
            particle.vz = Math.sin(angle) * speed * (0.5 + Math.random() * 0.5);
            particle.vy = verticalSpeed;
            
            particle.life = 0;
            particle.maxLife = 3 + Math.random() * 4;
          }
          
          // Update posisi
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.z += particle.vz;
          
          // Add slight gravity effect
          particle.vy -= 0.001;
          
          // Add slight swirl effect
          const swirl = time * 0.3 + i * 0.01;
          particle.x += Math.sin(swirl) * 0.002;
          particle.z += Math.cos(swirl) * 0.002;
          
          // Update positions array
          posArr[i * 3] = particle.x;
          posArr[i * 3 + 1] = particle.y;
          posArr[i * 3 + 2] = particle.z;
          
          // Update colors berdasarkan life (fade out)
          const lifeRatio = particle.life / particle.maxLife;
          const fade = 1.0 - lifeRatio;
          const greenIntensity = (0.4 + Math.random() * 0.6) * fade;
          colArr[i * 3] = 0.1 * greenIntensity;
          colArr[i * 3 + 1] = greenIntensity;
          colArr[i * 3 + 2] = 0.2 * greenIntensity;
        }
        
        positions.needsUpdate = true;
        colors.needsUpdate = true;
      }
    }
  });
  
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(particles.positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(particles.colors, 3));
    geom.setAttribute('size', new THREE.Float32BufferAttribute(particles.sizes, 1));
    return geom;
  }, [particles]);
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Renderer Setup Component - menggunakan useThree untuk akses yang aman
function RendererSetup() {
  const { gl, scene } = useThree();
  
  useEffect(() => {
    // Pastikan gl valid dan merupakan instance WebGLRenderer
    if (!gl || !(gl instanceof THREE.WebGLRenderer)) {
      console.warn('WebGLRenderer not available or invalid');
      return;
    }
    
    // Set shadow map dengan pengecekan yang aman
    try {
      if (gl.shadowMap && typeof gl.shadowMap === 'object') {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }
    } catch (error) {
      console.warn('Error setting shadow map:', error);
    }
    
    // Set clear color dengan pengecekan method
    try {
      if (typeof gl.setClearColor === 'function') {
        const clearColor = new THREE.Color(colors.dark1);
        gl.setClearColor(clearColor, 0.2);
      }
    } catch (error) {
      console.warn('Error setting clear color:', error);
    }
    
    // Set pixel ratio dengan pengecekan
    try {
      if (typeof gl.setPixelRatio === 'function' && typeof window !== 'undefined' && window.devicePixelRatio) {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    } catch (error) {
      console.warn('Error setting pixel ratio:', error);
    }
    
    // Pastikan auto clear aktif
    try {
      if (typeof gl.autoClear !== 'undefined') {
        gl.autoClear = true;
      }
    } catch (error) {
      console.warn('Error setting auto clear:', error);
    }
  }, [gl, scene]);
  
  return null;
}

// Main Scene - BENAR-BENAR STABIL, TIDAK ADA RE-RENDER
const Scene = memo(function Scene() {
  return (
    <>
      {/* Renderer setup */}
      <RendererSetup />
      
      {/* Skybox gradient background */}
      <Skybox />
      
      {/* Animated fog - SANGAT stabil */}
      <AnimatedFog />
      
      {/* Additional volumetric lighting untuk atmosfer - EKSTREM TERANG */}
      <pointLight
        position={[0, 5, 0]}
        intensity={8.0}
        color={0xffffff}
        distance={60}
        decay={1.5}
      />
      
      {/* Extra point light untuk visibility maksimal */}
      <pointLight
        position={[0, 3, 0]}
        intensity={6.0}
        color={0xffffff}
        distance={50}
        decay={1.5}
      />
      
      {/* Lighting */}
      <GoldenHourLighting />
      
      {/* Mountain */}
      <RealisticMountain />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Partikel bulat yang memancar dari piringan */}
      <DiskParticles />
      
      {/* Realistic rotating disk */}
      <RealisticDisk />
      
      {/* OrbitControls - disabled untuk background */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        minDistance={5}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />
      
      {/* Post-processing effects - DISABLED untuk mencegah flickering */}
      {/* EffectComposer sementara dinonaktifkan untuk stabilitas */}
      {/* <EffectComposer>
        <Bloom
          intensity={2.0}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          height={300}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration
          offset={[0.0005, 0.0005]}
        />
      </EffectComposer> */}
    </>
  );
});

export default function RealisticMountainScene() {
  // Memoize canvas config untuk mencegah re-render - STABIL
  const canvasConfig = useMemo(() => ({
    alpha: true, // Transparent agar terlihat di belakang Hero
    antialias: true,
    precision: 'highp' as const,
    powerPreference: 'high-performance' as const,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 2.5, // Lebih tinggi untuk visibility
    preserveDrawingBuffer: false, // Untuk performa
    stencil: false, // Tidak perlu stencil
    depth: true, // Pastikan depth buffer aktif
    premultipliedAlpha: false, // Untuk transparansi yang benar
  }), []);

  const cameraConfig = useMemo(() => ({
    position: [18, 6, 18] as [number, number, number],
    fov: 65,
  }), []);

  return (
    <div 
      className="fixed inset-0 z-[1] pointer-events-none" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        willChange: 'auto', // Optimasi rendering
      }}
    >
      <Canvas
        key="mountain-canvas" // Key untuk mencegah remount
        gl={canvasConfig}
        dpr={typeof window !== 'undefined' ? [1, Math.min(window.devicePixelRatio || 1, 2)] : [1, 2]}
        camera={cameraConfig}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        frameloop="always"
        performance={{ min: 0.8, max: 1 }}
        flat={false}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

