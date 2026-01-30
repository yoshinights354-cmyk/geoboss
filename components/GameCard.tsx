
import React from 'react';
import { Game } from '../types.ts';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div 
      className="group relative flex flex-col bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-300 border-x-4 border-b-[10px] border-slate-700 hover:border-indigo-600 shadow-2xl"
      onClick={() => onClick(game)}
    >
      {/* Cartridge Top Handle / Notch */}
      <div className="h-5 bg-slate-700/50 group-hover:bg-indigo-600/30 transition-colors flex justify-center items-center gap-1 border-b border-slate-900/50">
        <div className="w-10 h-1 bg-slate-900/40 rounded-full"></div>
        <div className="w-10 h-1 bg-slate-900/40 rounded-full"></div>
      </div>

      {/* Cartridge Label Area */}
      <div className="relative aspect-[4/3] overflow-hidden mx-2 mt-2 rounded-sm border-2 border-slate-900 shadow-inner bg-slate-950">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-yellow-400 flex items-center gap-1 border border-white/10">
          <i className="fas fa-star"></i>
          {game.rating}
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/50 border-2 border-indigo-400">
            <i className="fas fa-play ml-1"></i>
          </div>
        </div>
      </div>

      {/* Sticker Info Area */}
      <div className="p-3 bg-slate-800 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="font-black text-xs uppercase text-slate-100 group-hover:text-indigo-400 transition-colors truncate tracking-tighter">
              {game.title}
            </h3>
            <span className="text-[7px] font-black text-white bg-indigo-600 px-1.5 py-0.5 rounded-sm tracking-widest uppercase flex-shrink-0">
              {game.category}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight h-6 italic font-medium">
            {game.description}
          </p>
        </div>
        
        {/* Physical Detail Lines */}
        <div className="mt-3 flex flex-col gap-0.5 opacity-20">
          <div className="w-full h-[1px] bg-white"></div>
          <div className="w-2/3 h-[1px] bg-white"></div>
        </div>
      </div>

      {/* Featured Ribbon */}
      {game.featured && (
        <div className="absolute top-8 left-[-18px] bg-red-600 text-[8px] text-white font-black px-6 py-0.5 rotate-[-45deg] uppercase tracking-[0.2em] shadow-lg border-y border-red-400 z-10">
          LEGACY
        </div>
      )}
    </div>
  );
};

export default GameCard;
