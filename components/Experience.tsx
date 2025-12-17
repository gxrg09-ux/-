import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { ChristmasTree } from './Tree';
import { TreeConfig } from '../types';

interface ExperienceProps {
  config: TreeConfig;
}

export const Experience: React.FC<ExperienceProps> = ({ config }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 1, 9]} fov={35} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        color="#fff0d6"
      />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#004225" />
      <pointLight position={[0, -2, 3]} intensity={1.5} color={config.lightColor} distance={6} />

      {/* Environment Reflections */}
      <Environment preset="city" environmentIntensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <group position={[0, -1, 0]}>
        <ChristmasTree config={config} />
        <ContactShadows opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
      </group>

      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 2.5} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={5}
        maxDistance={12}
        autoRotate={config.isRotating}
        autoRotateSpeed={0.5}
      />

      {/* Post Processing for the "Glow" */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={config.intensity * 1.5} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
        <Noise opacity={0.05} /> 
      </EffectComposer>
    </Canvas>
  );
};
