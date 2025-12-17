import React, { useState } from 'react';
import { TreeConfig, GreetingRequest } from '../types';
import { generateRoyalGreeting } from '../services/geminiService';

interface OverlayProps {
  config: TreeConfig;
  setConfig: React.Dispatch<React.SetStateAction<TreeConfig>>;
}

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
  <button 
    onClick={onClick}
    className={`
      px-4 py-2 font-serif tracking-widest text-xs uppercase transition-all duration-300 border
      ${active 
        ? 'bg-arix-gold text-arix-dark border-arix-gold shadow-[0_0_15px_rgba(212,175,55,0.6)]' 
        : 'bg-transparent text-arix-gold border-arix-gold/30 hover:border-arix-gold hover:text-white'
      }
    `}
  >
    {children}
  </button>
);

export const Overlay: React.FC<OverlayProps> = ({ config, setConfig }) => {
  const [showGreeting, setShowGreeting] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleRotation = () => setConfig(prev => ({ ...prev, isRotating: !prev.isRotating }));
  
  const setGoldTheme = () => setConfig(prev => ({ ...prev, ornamentColor: '#D4AF37', lightColor: '#D4AF37' }));
  const setRoseTheme = () => setConfig(prev => ({ ...prev, ornamentColor: '#B76E79', lightColor: '#FFB7C5' }));
  const setSilverTheme = () => setConfig(prev => ({ ...prev, ornamentColor: '#C0C0C0', lightColor: '#E0E0E0' }));

  const handleGenerateGreeting = async () => {
    if (!recipient) return;
    setLoading(true);
    const text = await generateRoyalGreeting(recipient, 'Royal');
    setGeneratedText(text);
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Header */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif text-arix-gold drop-shadow-lg tracking-tight">
            ARIX
          </h1>
          <p className="text-arix-gold/60 font-sans text-xs tracking-[0.3em] mt-2 border-l-2 border-arix-gold pl-3">
            SIGNATURE COLLECTION
          </p>
        </div>
        <div className="flex gap-2">
           <Button onClick={() => setConfig(p => ({...p, intensity: p.intensity > 1 ? 0.5 : 2}))}>
             {config.intensity > 1 ? 'Dim Lights' : 'High Beam'}
           </Button>
        </div>
      </header>

      {/* Main Controls (Bottom) */}
      <footer className="pointer-events-auto flex flex-col md:flex-row justify-between items-end gap-6">
        
        {/* Theme Selectors */}
        <div className="bg-arix-glass backdrop-blur-md p-6 border border-arix-gold/20 rounded-sm">
          <h3 className="text-arix-gold font-serif text-sm mb-4 tracking-widest">AESTHETIC</h3>
          <div className="flex gap-3">
            <Button onClick={setGoldTheme} active={config.ornamentColor === '#D4AF37'}>Royal Gold</Button>
            <Button onClick={setRoseTheme} active={config.ornamentColor === '#B76E79'}>Velvet Rose</Button>
            <Button onClick={setSilverTheme} active={config.ornamentColor === '#C0C0C0'}>Frost Silver</Button>
          </div>
          <div className="mt-4 flex items-center gap-4">
             <span className="text-arix-gold/70 text-xs font-sans">ROTATION</span>
             <button 
                onClick={toggleRotation}
                className={`w-12 h-6 rounded-full border border-arix-gold/50 relative transition-colors ${config.isRotating ? 'bg-arix-gold/20' : ''}`}
             >
                <div className={`absolute top-1 w-4 h-4 bg-arix-gold rounded-full transition-all duration-500 ${config.isRotating ? 'left-7' : 'left-1'}`} />
             </button>
          </div>
        </div>

        {/* Gemini Generator Trigger */}
        <div className="flex flex-col items-end">
          <button 
            onClick={() => setShowGreeting(true)}
            className="group flex items-center gap-3 text-right"
          >
            <span className="text-arix-gold font-serif text-xl group-hover:tracking-widest transition-all duration-500">
              Compose Royal Greeting
            </span>
            <div className="w-12 h-12 border border-arix-gold rounded-full flex items-center justify-center group-hover:bg-arix-gold group-hover:text-arix-dark transition-colors text-arix-gold">
              ✎
            </div>
          </button>
        </div>
      </footer>

      {/* Greeting Modal */}
      {showGreeting && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center pointer-events-auto z-50">
          <div className="max-w-md w-full bg-arix-dark border border-arix-gold p-10 relative shadow-[0_0_50px_rgba(212,175,55,0.2)]">
            <button 
              onClick={() => setShowGreeting(false)}
              className="absolute top-4 right-4 text-arix-gold/50 hover:text-arix-gold"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-serif text-arix-gold mb-6 text-center">The Royal Scribe</h2>
            
            {!generatedText ? (
              <div className="space-y-6">
                 <div>
                   <label className="block text-arix-gold/60 text-xs font-sans tracking-widest mb-2">RECIPIENT NAME</label>
                   <input 
                      type="text" 
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-transparent border-b border-arix-gold/30 py-2 text-white focus:outline-none focus:border-arix-gold transition-colors font-serif text-xl"
                      placeholder="e.g., Lady Victoria"
                   />
                 </div>
                 <button 
                    disabled={loading || !recipient}
                    onClick={handleGenerateGreeting}
                    className="w-full py-4 bg-arix-gold text-arix-dark font-serif uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
                 >
                    {loading ? 'Consulting the Stars...' : 'Generate Inscription'}
                 </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-8 p-6 border-y border-arix-gold/20 relative">
                  <p className="font-serif text-xl text-white italic leading-relaxed">
                    "{generatedText}"
                  </p>
                </div>
                <button 
                  onClick={() => { setGeneratedText(''); setRecipient(''); }}
                  className="text-arix-gold/60 hover:text-arix-gold text-xs tracking-widest uppercase"
                >
                  Write Another
                </button>
              </div>
            )}
            
            <div className="mt-8 text-center">
               <span className="text-arix-gold/20 text-[10px] tracking-[0.5em] uppercase">Powered by Gemini</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
