import { motion } from "framer-motion";
import { useGamification } from "../../hooks/useGamification";
import { Zap } from "lucide-react";

export const LevelRing = () => {
  const { stats, levelProgress, rankColor, isAuthenticated } = useGamification();

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (levelProgress / 100) * circumference;

  return (
    <div className="relative group flex items-center justify-center cursor-pointer">
      <motion.div whileHover={{ scale: 1.05 }} className="relative flex items-center justify-center w-10 h-10">
        
        {/* SVG Ring Background */}
        <svg className="absolute inset-0 w-10 h-10 -rotate-90 transform">
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="stroke-muted/30"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx="20"
            cy="20"
            r={radius}
            className="transition-all duration-500 ease-out"
            stroke={rankColor}
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            initial={{ strokeDashoffset: circumference }}
            style={{ filter: `drop-shadow(0 0 4px ${rankColor})` }}
          />
        </svg>

        {/* Avatar or Pokeball */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-full overflow-hidden">
          {isAuthenticated && stats.avatarUrl ? (
            <img src={stats.avatarUrl} alt="Avatar" className="w-8 h-8 object-contain rounded-full" />
          ) : (
            /* Mini Pokeball CSS */
            <div className="w-6 h-6 rounded-full border-2 border-gray-600 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white border border-gray-600 rounded-full"></div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tooltip on hover */}
      <div className="absolute top-12 right-0 w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
        <div className="glass-green p-3 rounded-lg border shadow-lg flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: rankColor }} />
            <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {isAuthenticated ? stats.levelName : "Iniciar Sesión"}
            </span>
          </div>
          {isAuthenticated ? (
            <div className="text-xs text-muted-foreground font-mono">
              EVs: {stats.xp} / {stats.nextLevelXP}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Clic para recibir tu Pokémon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
