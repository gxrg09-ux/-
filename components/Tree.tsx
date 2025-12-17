import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Instance, Instances, Outlines, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { TreeConfig } from '../types';

interface TreeProps {
  config: TreeConfig;
}

const TreeLayer: React.FC<{ 
  position: [number, number, number]; 
  scale: number; 
  radius: number;
  color: string; 
}> = ({ position, scale, radius, color }) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <coneGeometry args={[radius, 1.5, 64]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.7} 
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.1}
      />
      <Outlines thickness={0.02} color="#001a0f" />
    </mesh>
  );
};

// Procedural placement of ornaments in a spiral
const SpiralOrnaments: React.FC<{ 
  count: number; 
  color: string; 
  yStart: number; 
  yEnd: number; 
  radiusStart: number; 
  radiusEnd: number;
  phaseOffset?: number;
  size?: number;
}> = ({ 
  count, 
  color,
  yStart,
  yEnd,
  radiusStart,
  radiusEnd,
  phaseOffset = 0,
  size = 0.12
}) => {
  const data = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 10 + phaseOffset; 
      const y = THREE.MathUtils.lerp(yStart, yEnd, t);
      const r = THREE.MathUtils.lerp(radiusStart, radiusEnd, t);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      temp.push({ position: [x, y, z], rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] });
    }
    return temp;
  }, [count, yStart, yEnd, radiusStart, radiusEnd, phaseOffset]);

  return (
    <Instances range={count}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.1} 
        metalness={1} 
        envMapIntensity={2} 
      />
      {data.map((props, i) => (
        <Instance key={i} position={props.position as [number, number, number]} />
      ))}
    </Instances>
  );
};

// A dense strand of small pearls/beads wrapping the tree
const PearlGarland: React.FC<{
  color: string;
  radiusStart: number;
  radiusEnd: number;
  yStart: number;
  yEnd: number;
  turns: number;
}> = ({ color, radiusStart, radiusEnd, yStart, yEnd, turns }) => {
  const count = 150; // Dense
  const data = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * turns; 
      const y = THREE.MathUtils.lerp(yStart, yEnd, t);
      const r = THREE.MathUtils.lerp(radiusStart, radiusEnd, t) + 0.1; // Slightly offset
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      temp.push({ position: [x, y, z] });
    }
    return temp;
  }, [count, turns, yStart, yEnd, radiusStart, radiusEnd]);

  return (
    <Instances range={count}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.2}
      />
      {data.map((props, i) => (
        <Instance key={i} position={props.position as [number, number, number]} />
      ))}
    </Instances>
  );
};

// Tiny emissive lights scattered randomly
const FairyLights: React.FC<{ count: number; color: string }> = ({ count, color }) => {
  const data = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Rough cone distribution: Height -0.5 to 3.5
      const y = THREE.MathUtils.randFloat(-0.5, 3.5);
      // Radius approx
      const progress = (y + 0.5) / 4.0;
      const rBase = (1 - progress) * 2.3;
      // Add randomness to depth to put some lights inside
      const r = rBase * THREE.MathUtils.randFloat(0.8, 1.1);
      const angle = Math.random() * Math.PI * 2;
      
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      temp.push({ position: [x, y, z] });
    }
    return temp;
  }, [count]);

  return (
    <Instances range={count}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial 
        color={color} 
        toneMapped={false}
        emissive={color}
        emissiveIntensity={3}
      />
      {data.map((props, i) => (
        <Instance key={i} position={props.position as [number, number, number]} />
      ))}
    </Instances>
  );
};

export const ChristmasTree: React.FC<TreeProps> = ({ config }) => {
  const groupRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current && config.isRotating) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (starRef.current) {
      starRef.current.rotation.y -= delta * 0.5;
      starRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      starRef.current.scale.set(scale, scale, scale);
    }
  });

  const emeraldGreen = "#004225";
  // Secondary color for garlands (lighter version of ornament color or fixed gold/silver)
  const garlandColor = config.ornamentColor === '#C0C0C0' ? '#FFFFFF' : '#F4CF57'; 

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
        {/* Tree Layers */}
        <TreeLayer position={[0, 0, 0]} scale={1} radius={2.5} color={emeraldGreen} />
        <TreeLayer position={[0, 1.2, 0]} scale={0.8} radius={2.0} color={emeraldGreen} />
        <TreeLayer position={[0, 2.4, 0]} scale={0.6} radius={1.5} color={emeraldGreen} />
        <TreeLayer position={[0, 3.4, 0]} scale={0.4} radius={1.0} color={emeraldGreen} />
        
        {/* === DECORATIONS === */}

        {/* 1. Primary Ornaments (Large) - increased count */}
        <SpiralOrnaments count={18} color={config.ornamentColor} yStart={-0.5} yEnd={3.0} radiusStart={2.4} radiusEnd={0.8} size={0.14} />
        
        {/* 2. Secondary Ornaments (Offset, slightly smaller) */}
        <SpiralOrnaments count={15} color={config.ornamentColor} yStart={-0.5} yEnd={3.0} radiusStart={2.4} radiusEnd={0.8} phaseOffset={Math.PI} size={0.10} />

        {/* 3. Pearl Garlands (Wrapping the tree) */}
        <PearlGarland color={garlandColor} radiusStart={2.6} radiusEnd={0.4} yStart={-0.6} yEnd={3.8} turns={4.5} />

        {/* 4. Fairy Lights (Random Sparkles) */}
        <FairyLights count={80} color={config.lightColor} />

        {/* The Star */}
        <mesh ref={starRef} position={[0, 4.3, 0]}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial 
            color={config.lightColor} 
            emissive={config.lightColor}
            emissiveIntensity={config.intensity * 3}
            toneMapped={false}
          />
          <pointLight color={config.lightColor} intensity={2} distance={5} decay={2} />
        </mesh>

        {/* Ambient Particles - increased density for atmosphere */}
        <Sparkles count={80} scale={7} size={3} speed={0.3} opacity={0.6} color={config.lightColor} />
      </Float>
      
      {/* Base */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 0.7, 1, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  );
};
