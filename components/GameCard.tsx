import React from 'react';
import { Game } from '../types.ts';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div 
      className="group relative flex flex-col bg-slate-900 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.04] transition-all duration-300 border-x-4 border-b-[10px] border-slate-800 hover:border-indigo-600 shadow-2xl cartridge-glow active:scale-95"
      onClick={() => onClick(game)}
    >
      {/* Physical "Handle" on top of the cartridge */}
      <div className="h-6 bg-slate-800/40 group-hover:bg-indigo-600/20 transition-colors flex justify-center items-center gap-1.5 border-b border-black/40">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-6 h-1 bg-black/20 rounded-full"></div>
        ))}
      </div>

      {/* Cartridge Label Art */}
      <div className="relative aspect-[16/11] overflow-hidden mx-2 mt-2 rounded border border-black shadow-inner bg-slate-950">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Rating & Metadata Badges */}
        <div className="absolute top-1.5 right-1.5 flex gap-1">
          <div className="bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-yellow-400 flex items-center gap-1 border border-white/5">
            <i className="fas fa-star"></i>
            {game.rating}
          </div>
        </div>
        
        {/* Holographic "Play" Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
          <div className="w-14 h-14 bg-indigo-600/90 rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-white/20">
            <i className="fas fa-play ml-1 text-xl"></i>
          </div>
        </div>
      </div>

      {/* Info Label (Sticker aesthetic) */}
      <div className="p-3 bg-slate-900 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[11px] uppercase text-white group-hover:text-indigo-400 transition-colors truncate tracking-tight">
              {game.title}
            </h3>
            <span className="text-[7px] font-black text-indigo-100 bg-indigo-600 px-1.5 py-0.5 rounded-sm tracking-widest uppercase flex-shrink-0">
              {game.category}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight italic font-medium h-6">
            {game.description}
          </p>
        </div>
        
        {/* Visual Hardware details */}
        <div className="mt-3 flex justify-between items-end opacity-30">
          <div className="flex flex-col gap-0.5">
            <div className="w-16 h-[1px] bg-white"></div>
            <div className="w-10 h-[1px] bg-white"></div>
          </div>
          <div className="text-[7px] font-bold text-white tracking-widest">NV-99X</div>
        </div>
      </div>

      {/* Featured Ribbon */}
      {game.featured && (
        <div className="absolute top-8 left-[-16px] bg-indigo-500 text-[8px] text-white font-black px-6 py-0.5 rotate-[-45deg] uppercase tracking-[0.2em] shadow-lg border-y border-white/10 z-10">
          FEATURED
        </div>
      )}
    </div>
  );
};

export default GameCard;