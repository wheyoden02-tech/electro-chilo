import React, { useState } from 'react';
import { GameData } from '@/lib/googleSheets';
import { GameCard } from './GameCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface GameListProps {
  games: GameData[];
  selectedGames: GameData[];
  onToggleGame: (game: GameData) => void;
}

export const GameList: React.FC<GameListProps> = ({ games, selectedGames, onToggleGame }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Extract unique categories
  const categories = ['Todas', ...Array.from(new Set(games.map(g => g.categoria))).sort()];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || game.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Filters HUD */}
      <div className="sticky top-0 z-10 space-y-4 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Buscar juego por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border-white/10 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-[#00ffcc]"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                categoryFilter === cat 
                  ? 'bg-[#00ffcc] text-black shadow-[0_0_10px_rgba(0,255,204,0.4)]' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of games */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isSelected={selectedGames.some(sg => sg.id === game.id)}
              onToggle={onToggleGame}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
            <p>No se encontraron juegos para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
