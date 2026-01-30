import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout.tsx';
import GameCard from './components/GameCard.tsx';
import GamePlayer from './components/GamePlayer.tsx';
import { Game } from './types.ts';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await fetch('./games.json');
        if (!response.ok) throw new Error('Failed to load games data');
        const data = await response.json();
        setGames(data.games as Game[]);
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? game.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, selectedCategory]);

  const featuredGames = useMemo(() => {
    return games.filter(g => g.featured).slice(0, 3);
  }, [games]);

  const handleGameSelect = (game: Game) => {
    setActiveGame(game);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Initializing NovaGames...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      onSearch={setSearchQuery} 
      onSelectCategory={setSelectedCategory}
      selectedCategory={selectedCategory}
    >
      <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
        
        {/* Banner Section (Only on "All Games") */}
        {!selectedCategory && !searchQuery && featuredGames.length > 0 && (
          <section className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/featured-hero/1200/600" 
              className="w-full h-full object-cover"
              alt="Featured Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-center px-8 md:px-16">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Trending Now</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-lg drop-shadow-lg">
                The New Era of <span className="text-indigo-500">Unblocked</span> Gaming
              </h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleGameSelect(featuredGames[0])}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                >
                  Play Now
                </button>
                <button className="glass-card hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95">
                  Browse List
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section Header */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedCategory ? `${selectedCategory} Games` : searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended for You'}
              </h2>
              <p className="text-sm text-slate-400">
                {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} available to play right now.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Game Grid */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onClick={handleGameSelect}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600 text-3xl">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No games found</h3>
              <p className="text-slate-500 max-w-xs">
                We couldn't find any games matching your current search or category filter.
              </p>
              <button 
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                className="mt-6 text-indigo-400 font-semibold hover:text-indigo-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <footer className="pt-20 pb-8 text-center text-slate-500 text-xs">
          <p>© 2024 NovaGames Network. High performance unblocked web gaming platform.</p>
          <div className="flex justify-center gap-6 mt-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact Us</span>
          </div>
        </footer>
      </div>

      {/* Game Player Overlay */}
      {activeGame && (
        <GamePlayer 
          game={activeGame} 
          onClose={() => setActiveGame(null)} 
        />
      )}
    </Layout>
  );
};

export default App;