import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "../../hooks/useGamification";

export const LevelUpOverlay = () => {
  const { stats, recentLevelUp, clearPopups, rankColor } = useGamification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (recentLevelUp) {
      setIsVisible(true);
      clearPopups();
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3500); // Overlay disappears after 3.5s
      return () => clearTimeout(timer);
    }
  }, [recentLevelUp, clearPopups]);

  // Generate random particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200 - 100,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 0.2,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          {/* Flash Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white"
          />

          {/* Particle Burst */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                backgroundColor: rankColor,
                width: p.size,
                height: p.size,
                filter: `drop-shadow(0 0 6px ${rankColor})`
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 1, ease: "easeOut", delay: p.delay }}
            />
          ))}

          {/* Main Text Label */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-xl md:text-2xl font-black italic uppercase tracking-widest text-white drop-shadow-md">
              ✦ Level Up ✦
            </div>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50 w-full"
            />
            
            <div 
              className="text-3xl md:text-5xl font-black tracking-wider bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, #fff, ${rankColor})`,
                filter: `drop-shadow(0 0 10px ${rankColor})`
              }}
            >
              {stats.levelName}
            </div>
            
            <div className="text-sm font-mono mt-2" style={{ color: rankColor }}>
              RANK {stats.level} UNLOCKED
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
