import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGamification } from "../../hooks/useGamification";
import { Search } from "lucide-react";

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export const PokemonSelector = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { stats, updateProfile } = useGamification();
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Load first 151 Pokemons (Gen 1)
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await res.json();
        
        const formatted = data.results.map((p: any, index: number) => {
          const id = index + 1;
          return {
            id,
            name: p.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        });
        
        setPokemonList(formatted);
      } catch (err) {
        console.error("Failed to load pokemon", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (open && pokemonList.length === 0) {
      fetchPokemons();
    }
  }, [open, pokemonList.length]);

  const filtered = pokemonList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelect = (id: number) => {
    updateProfile(stats.displayName, id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Elige a tu Compañero
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-4 gap-2">
          {loading ? (
            <div className="col-span-4 text-center py-10 text-muted-foreground">Cargando la Pokédex...</div>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`
                  flex flex-col items-center p-2 rounded-lg border transition-all hover:bg-white/5
                  ${stats.pokemonId === p.id ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'border-border/50'}
                `}
              >
                <img src={p.sprite} alt={p.name} className="w-12 h-12 pixelated object-contain" />
                <span className="text-[10px] capitalize font-mono text-muted-foreground mt-1 truncate w-full text-center">
                  {p.name}
                </span>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
