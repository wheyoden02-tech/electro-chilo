import { useContext } from "react";
import { GamificationContext } from "../context/UserStatsContext";

export const getRankColor = (level: number) => {
  switch (level) {
    case 0: return "hsl(var(--platinum))";
    case 1: return "hsl(var(--neon-cyan))";
    case 2: return "hsl(var(--neon-green))";
    case 3: return "#ff00ff"; // pink/magenta
    default: return "#00ff7f"; // Cyber Ninja
  }
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }

  const { stats, addXP, recentBadges, recentLevelUp, clearPopups } = context;

  const currentRankMinXP = stats.level === 0 ? 0 : 
    (stats.level === 1 ? 10 : 
    (stats.level === 2 ? 25 : 
    (stats.level === 3 ? 50 : 100)));
    
  const levelProgress = stats.level >= 4 ? 100 : Math.min(
    100,
    ((stats.xp - currentRankMinXP) / (stats.nextLevelXP - currentRankMinXP)) * 100
  );

  return {
    ...context,
    levelProgress,
    rankColor: getRankColor(stats.level)
  };
};
