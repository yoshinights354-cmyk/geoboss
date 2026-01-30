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
        console.error(err.message);
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
      // Wipe the frame to a blank state to clear cache/detection scripts
      iframeRef.current.src = "about:blank";
      
      // Inject back the URL after a momentary delay to trick some local filters
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentUrl;
        }
      }, 100);
    }
  };

  const handleStrikeBypass = () => {
    // Ultimate Bypass: Creates a local Blob document and injects the game
    // This makes the 'origin' of the page a blob, which confuses many trackers
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${game.title} - Educational System</title>
          <style>body,html{margin:0;padding:0;height:100vh;overflow:hidden;background:#000}</style>
        </head>
        <body>
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
    // ABO:BLANK method - creates a window with no URL history
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert("POPUP BLOCKED!\nEnable popups to use the ABO:BLANK bypass.");
      return;
    }

    win.document.title = "Google Tasks"; 
    const body = win.document.body;
    body.style.margin = '0';
    body.style.height = '100vh';
    body.style.overflow = 'hidden';
    body.style.backgroundColor = '#000';

    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = game.url;
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; encrypted-media; fullscreen; clipboard-read; clipboard-write; gamepad";
    
    body.appendChild(iframe);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950 animate-in">
      {/* Game Header */}
      <div className="glass-card flex items-center justify-between px-4 md:px-8 py-3 shadow-2xl z-10 border-b border-indigo-500/20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="hidden sm:block">
            <h2 className="font-black text-lg text-white uppercase tracking-tighter italic leading-none">{game.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
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
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black transition-all border border-slate-700"
            title="Force reload frame"
          >
            <i className="fas fa-sync-alt"></i>
            FORCE RUN
          </button>
          <button 
            onClick={handleStrikeBypass}
            className="flex items-center gap-2 bg-indigo-900/40 hover:bg-indigo-700 text-indigo-300 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black transition-all border border-indigo-500/30 shadow-lg"
            title="Inject Blob Source (Defeats Gloria)"
          >
            <i className="fas fa-bolt-lightning"></i>
            STRIKE BYPASS
          </button>
          <button 
            onClick={openInBlank}
            className="hidden lg:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-[10px] font-black transition-all shadow-lg shadow-indigo-500/20"
            title="Open in ABO:BLANK"
          >
            <i className="fas fa-mask"></i>
            ABO:BLANK
          </button>
          <button 
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>
        </div>
      </div>

      {/* Game Frame */}
      <div id="game-container" className="flex-1 bg-black relative flex items-center justify-center">
        <iframe
          ref={iframeRef}
          src={game.url}
          className="w-full h-full border-0"
          title={game.title}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; clipboard-read; clipboard-write; gamepad"
        />
      </div>

      {/* Evasion Info */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/30 rounded flex items-center justify-center text-indigo-400">
               <i className="fas fa-shield-virus"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Filter Evasion Engine v2.0</p>
              <p className="text-slate-500 text-[10px] font-medium">
                Gloria or Linewize still blocking? Use <strong>STRIKE BYPASS</strong> or <strong>ABO:BLANK</strong> for total stealth.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tunnel Secured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;