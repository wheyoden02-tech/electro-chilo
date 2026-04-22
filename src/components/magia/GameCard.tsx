import React from 'react';
import { GameData } from '@/lib/googleSheets';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameCardProps {
  game: GameData;
  isSelected: boolean;
  onToggle: (game: GameData) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, isSelected, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
        isSelected 
          ? 'border-[#00ffcc] bg-[#00ffcc]/10 shadow-[0_0_15px_rgba(0,255,204,0.3)]' 
          : 'border-white/10 bg-black/40 hover:border-white/30'
      } backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Gamepad2 className={`h-4 w-4 ${isSelected ? 'text-[#00ffcc]' : 'text-zinc-500'}`} />
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {game.categoria}
            </span>
          </div>
          <h3 className="font-bold text-white line-clamp-2 leading-tight">
            {game.nombre}
          </h3>
          <p className="text-sm font-medium text-[#00ffcc]">
            {game.tamañoGB.toFixed(1)} GB
          </p>
        </div>
        
        <Button
          size="icon"
          variant={isSelected ? "destructive" : "default"}
          className={`h-10 w-10 shrink-0 rounded-full transition-colors ${
            !isSelected && 'bg-[#00ffcc] text-black hover:bg-[#00ccaa]'
          }`}
          onClick={() => onToggle(game)}
        >
          {isSelected ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </Button>
      </div>

      {/* Stylized background glow */}
      {isSelected && (
        <div className="absolute -inset-2 z-[-1] bg-gradient-to-r from-[#00ffcc]/0 via-[#00ffcc]/10 to-[#00ffcc]/0 blur-xl" />
      )}
    </motion.div>
  );
};
