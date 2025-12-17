import React, { useState, Suspense } from 'react';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { TreeConfig } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<TreeConfig>({
    lightColor: '#D4AF37', // Arix Gold
    ornamentColor: '#D4AF37',
    isRotating: true,
    intensity: 1.5,
  });

  return (
    <div className="relative w-full h-full bg-arix-dark">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-arix-gold font-serif animate-pulse">
          PREPARING THE SALON...
        </div>
      }>
        <Experience config={config} />
      </Suspense>
      <Overlay config={config} setConfig={setConfig} />
    </div>
  );
};

export default App;
