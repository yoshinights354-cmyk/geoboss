
import React, { useState, useRef } from 'react';
import { Game } from '../types.ts';

interface GamePlayerProps {
  game: Game;
  onClose: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bypassMode, setBypassMode] = useState<'standard' | 'strike'>('standard');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    const player = document.getElementById('game-container');
    if (!player) return;

    if (!document.fullscreenElement) {
      player.requestFullscreen().catch(err => {
        alert(`Error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleForceRun = () => {
    if (iframeRef.current) {
      const currentUrl = game.url;
      // First, wipe to blank to clear any tracking state or block overlays
      iframeRef.current.src = "about:blank";
      
      // Immediately set back to the target URL to force a fresh session
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentUrl;
        }
      }, 50);
    }
  };

  const handleStrikeBypass = () => {
    // Advanced bypass: Injects the content via a local Blob URL 
    // to bypass extension-based URL filtering (Gloria/Linewize)
    const content = `
      <html>
        <body style="margin:0;overflow:hidden;background:#000">
          <iframe src="${game.url}" style="border:none;width:100%;height:100vh" allowfullscreen allow="autoplay; encrypted-media; fullscreen; clipboard-read; clipboard-write; gamepad"></iframe>
        </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    
    if (iframeRef.current) {
      iframeRef.current.src = blobUrl;
      setBypassMode('strike');
    }
  };

  const openInBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      alert("POPUP BLOCKED!\nPlease enable popups to use the ABO:BLANK bypass.");
      return;
    }

    win.document.title = "Google Drive"; 
    const body = win.document.body;
    body.style.margin = '0';
    body.style.height = '100vh';
    body.style.overflow = 'hidden';
    body.style.backgroundColor = '#000';

    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = game.url;
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; encrypted-media; fullscreen; clipboard-read; clipboard-write; gamepad";
    
    body.appendChild(iframe);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950 animate-in fade-in duration-300">
      {/* Game Header */}
      <div className="glass-card flex items-center justify-between px-4 md:px-8 py-3 border-t-0 border-x-0 shadow-2xl z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="hidden sm:block">
            <h2 className="font-black text-lg leading-tight text-white uppercase tracking-tighter italic">{game.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span className={`px-2 py-0.5 rounded-sm text-white ${bypassMode === 'strike' ? 'bg-red-600 animate-pulse' : 'bg-indigo-600'}`}>
                {bypassMode === 'strike' ? 'STRIKE ACTIVE' : game.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-yellow-500">
                <i className="fas fa-star text-[10px]"></i> {game.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleForceRun}
            className="flex items-center gap-2 bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black transition-all border border-orange-500/30 shadow-lg"
            title="Force reload via about:blank cycle"
          >
            <i className="fas fa-sync-alt"></i>
            FORCE RUN
          </button>
          <button 
            onClick={handleStrikeBypass}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black transition-all border border-red-500/30 shadow-lg"
            title="Injects code via Blob URL to defeat extension trackers"
          >
            <i className="fas fa-skull"></i>
            STRIKE BYPASS
          </button>
          <button 
            onClick={openInBlank}
            className="hidden lg:flex items-center gap-2 bg-indigo-900/40 hover:bg-indigo-700 text-indigo-300 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black transition-all border border-indigo-500/30"
            title="Open in a clean window"
          >
            <i className="fas fa-ghost"></i>
            ABO:BLANK
          </button>
          <button 
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div id="game-container" className="flex-1 bg-black relative flex items-center justify-center shadow-inner">
        <iframe
          ref={iframeRef}
          src={game.url}
          className="w-full h-full border-0"
          title={game.title}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; clipboard-read; clipboard-write; gamepad"
        />
      </div>

      {/* Footer / Meta / Guidance */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex-1 flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/30 rounded flex items-center justify-center text-indigo-400">
               <i className="fas fa-user-secret text-2xl"></i>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Stealth Engine</h3>
              <p className="text-slate-500 text-[10px] leading-tight max-w-2xl font-medium">
                Gloria or Linewize still watching? <strong>STRIKE BYPASS</strong> uses local Blob injection to hide your URL. 
                <strong>FORCE RUN</strong> re-triggers execution. For total immunity, use the <strong>ABO:BLANK</strong> button to open a disconnected window.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
               <p className="text-[9px] text-slate-500 uppercase font-black text-center mb-1">Tunnel Status</p>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-bold text-white tracking-widest uppercase">Encrypted</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
