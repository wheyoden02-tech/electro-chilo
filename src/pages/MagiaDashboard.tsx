import React, { useEffect, useState } from 'react';
import { GameData, fetchGamesData } from '@/lib/googleSheets';
import { GameList } from '@/components/magia/GameList';
import { MagiaSidebar } from '@/components/magia/MagiaSidebar';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function MagiaDashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameData[]>([]);
  const [selectedGames, setSelectedGames] = useState<GameData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Magia | ElectroRepara";
    async function loadData() {
      try {
        const data = await fetchGamesData();
        setGames(data);
      } catch (error) {
        toast.error('Error cargando la lista de juegos.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleGame = (game: GameData) => {
    setSelectedGames(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (exists) {
        return prev.filter(g => g.id !== game.id);
      } else {
        return [...prev, game];
      }
    });
  };

  const totalGB = selectedGames.reduce((acc, game) => acc + game.tamañoGB, 0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-[#00ffcc]">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 animate-pulse text-lg font-bold tracking-widest">INICIALIZANDO SISTEMA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-[#00ffcc] selection:text-black">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>
      {/* Decorative background grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
            SISTEMA DE <span className="text-[#00ffcc]">MAGIA</span>
          </h1>
          <p className="mt-2 text-lg text-zinc-400">
            Selecciona tu arsenal. Nosotros hacemos el resto.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9 xl:col-span-9">
            <div className="max-h-[55vh] overflow-y-auto custom-scroll rounded-xl border border-white/10 bg-black/30 p-3
                            lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
              <GameList 
                games={games} 
                selectedGames={selectedGames} 
                onToggleGame={handleToggleGame} 
              />
            </div>
          </div>
          
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] h-auto">
              <MagiaSidebar selectedGames={selectedGames} totalGB={totalGB} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
