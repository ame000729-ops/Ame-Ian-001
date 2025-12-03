import React, { useState } from 'react';
import Scene from './components/Scene';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);
  const [showInfo, setShowInfo] = useState(false);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene treeState={treeState} />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl text-yellow-100 font-bold tracking-widest luxury-text drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              ARIX
            </h1>
            <h2 className="text-sm md:text-lg text-emerald-400 tracking-[0.3em] mt-2 uppercase border-b border-emerald-800 pb-2 inline-block">
              Signature Collection
            </h2>
          </div>
          
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="pointer-events-auto text-xs text-yellow-100/50 hover:text-yellow-100 border border-yellow-100/20 hover:border-yellow-100/50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-500"
          >
            {showInfo ? '✕' : 'i'}
          </button>
        </header>

        {/* Info Modal */}
        <div className={`transition-opacity duration-700 ease-in-out ${showInfo ? 'opacity-100' : 'opacity-0'}`}>
            {showInfo && (
                <div className="max-w-md bg-black/60 backdrop-blur-md border-l-2 border-yellow-500 p-6 text-yellow-50">
                    <h3 className="text-xl luxury-text mb-2 text-yellow-200">The Golden Hour</h3>
                    <p className="font-light text-sm leading-relaxed opacity-80">
                        Experience the convergence of digital artistry and festive tradition. 
                        Composed of over 3,000 individual platinum cubes, emerald tetrahedrons, and metallic spheres, 
                        reacting in real-time to form the quintessential symbol of the season.
                    </p>
                </div>
            )}
        </div>

        {/* Controls */}
        <footer className="flex flex-col items-center gap-6 pointer-events-auto">
           <div className="flex gap-8 items-center">
             <div className={`h-[1px] w-12 transition-all duration-700 ${treeState === TreeState.SCATTERED ? 'bg-yellow-100/20' : 'bg-yellow-400 shadow-[0_0_10px_#FCD34D]'}`} />
             <button
                onClick={toggleState}
                className="group relative px-8 py-3 overflow-hidden transition-all duration-300"
             >
                <div className="absolute inset-0 border border-yellow-200/30 rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="absolute inset-0 border border-yellow-200/30 -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className={`absolute inset-0 bg-yellow-500/10 blur-xl transition-opacity duration-500 ${treeState === TreeState.TREE_SHAPE ? 'opacity-100' : 'opacity-0'}`}></div>
                
                <span className="relative z-10 text-yellow-100 font-serif tracking-[0.2em] text-sm uppercase group-hover:text-white transition-colors">
                  {treeState === TreeState.TREE_SHAPE ? 'Deconstruct' : 'Assemble'}
                </span>
             </button>
             <div className={`h-[1px] w-12 transition-all duration-700 ${treeState === TreeState.SCATTERED ? 'bg-yellow-400 shadow-[0_0_10px_#FCD34D]' : 'bg-yellow-100/20'}`} />
           </div>
           
           <p className="text-[10px] text-yellow-100/30 tracking-widest uppercase">
              Interactive WebGL Experience
           </p>
        </footer>
      </div>
    </div>
  );
};

export default App;