
import React, { ReactNode, useState, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
  onSearch: (query: string) => void;
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch, onSelectCategory, selectedCategory }) => {
  const categories = ['Action', 'Arcade', 'Puzzle', 'Sports', 'Strategy', 'Racing', 'Classic', 'Apps'];
  const [isCloaked, setIsCloaked] = useState(false);

  const toggleCloak = () => {
    const newState = !isCloaked;
    setIsCloaked(newState);
    if (newState) {
      document.title = "Google Docs";
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
      document.getElementsByTagName('head')[0].appendChild(link);
    } else {
      document.title = "NovaGames | Unblocked Gaming Hub";
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) link.href = "https://cdn.pixabay.com/photo/2013/07/13/10/22/gamepad-157095_1280.png";
    }
  };

  const forceUnblockHelp = () => {
    alert("BYPASS GUIDE:\n1. Use Stealth Mode to change your tab to Google Docs.\n2. Use 'FORCE RUN' if the game frame is blocked by a local script.\n3. Use 'STRIKE BYPASS' to inject games into a blob URL (hides URL from Linewize).\n4. If the site is blocked, search for 'Interstellar' or 'Ultraviolet' in our Apps category.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-indigo-500/20">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { onSelectCategory(null); onSearch(''); }}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:scale-110 transition-all text-white border border-indigo-400/50">
            <i className="fas fa-gamepad text-xl"></i>
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tighter uppercase italic">
            NovaGames
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="text"
            placeholder="Search 100+ cartridges & unblocked apps..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-white placeholder-slate-600 shadow-inner"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-black">
          <button 
            onClick={toggleCloak}
            className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all uppercase tracking-widest ${isCloaked ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500 hover:text-white'}`}
          >
            <i className={`fas ${isCloaked ? 'fa-eye-slash' : 'fa-user-secret'}`}></i>
            {isCloaked ? 'STEALTH ACTIVE' : 'STEALTH MODE'}
          </button>
          <button 
            onClick={forceUnblockHelp}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-indigo-500/20 hidden md:flex items-center gap-2 uppercase tracking-widest border border-indigo-400/50"
          >
            <i className="fas fa-bolt text-yellow-300"></i>
            BYPASS GUIDE
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 glass-card border-t-0 border-l-0 p-6 space-y-8">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Portal</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => onSelectCategory(null)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${!selectedCategory ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'border-transparent text-slate-500 hover:bg-slate-900 hover:text-white'}`}
              >
                <i className="fas fa-th-large w-5 text-center"></i>
                <span className="text-xs font-bold uppercase tracking-wider">All Library</span>
              </li>
              <li 
                onClick={() => onSelectCategory('Apps')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${selectedCategory === 'Apps' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'border-transparent text-slate-500 hover:bg-slate-900 hover:text-white'}`}
              >
                <i className="fas fa-rocket w-5 text-center"></i>
                <span className="text-xs font-bold uppercase tracking-wider">Apps & Proxies</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Cartridges</h3>
            <ul className="space-y-1 overflow-y-auto max-h-[35vh] pr-2 custom-scroll">
              {categories.filter(c => c !== 'Apps').map((cat) => (
                <li 
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'border-transparent text-slate-500 hover:bg-slate-900 hover:text-white'}`}
                >
                  <i className={`fas ${getCategoryIcon(cat)} w-5 text-center`}></i>
                  <span className="text-xs font-bold uppercase tracking-wider">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Network Tools</h3>
            <ul className="space-y-1">
              <li 
                onClick={forceUnblockHelp}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <i className="fas fa-skull-crossbones w-5 text-center"></i>
                <span className="text-xs font-bold uppercase tracking-wider italic">Filter Kill</span>
              </li>
              <li className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-colors">
                <i className="fas fa-globe w-5 text-center"></i>
                <span className="text-xs font-bold uppercase tracking-wider">Global Proxies</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};

const getCategoryIcon = (cat: string) => {
  switch(cat) {
    case 'Action': return 'fa-bolt';
    case 'Arcade': return 'fa-ghost';
    case 'Puzzle': return 'fa-puzzle-piece';
    case 'Sports': return 'fa-basketball';
    case 'Strategy': return 'fa-chess';
    case 'Racing': return 'fa-flag-checkered';
    case 'Classic': return 'fa-star';
    case 'Apps': return 'fa-rocket';
    default: return 'fa-folder';
  }
};

export default Layout;
