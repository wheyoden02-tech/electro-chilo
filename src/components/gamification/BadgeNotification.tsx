import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "../../hooks/useGamification";
import { ALL_BADGES } from "../../context/UserStatsContext";
import { Cpu, Search, MessageCircle, Zap, Gamepad2, BrainCircuit, Rocket, Skull } from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Zap": return <Zap className="w-5 h-5 text-[#00e64d]" />;
    case "MessageCircle": return <MessageCircle className="w-5 h-5 text-[#00d4ff]" />;
    case "Search": return <Search className="w-5 h-5 text-yellow-400" />;
    case "Cpu": return <Cpu className="w-5 h-5 text-[#00d4ff]" />;
    case "Gamepad2": return <Gamepad2 className="w-5 h-5 text-[#ff00ff]" />;
    case "BrainCircuit": return <BrainCircuit className="w-5 h-5 text-[#00e64d]" />;
    case "Rocket": return <Rocket className="w-5 h-5 text-[#ff00ff]" />;
    case "Skull": return <Skull className="w-5 h-5 text-red-500" />;
    default: return <Zap className="w-5 h-5 text-[#00e64d]" />;
  }
};

export const BadgeNotification = () => {
  const { recentBadges, clearPopups } = useGamification();
  const [visibleBadges, setVisibleBadges] = useState<typeof ALL_BADGES>([]);

  useEffect(() => {
    if (recentBadges.length > 0) {
      // Add new badges to display queue
      setVisibleBadges((prev) => {
        const newBadges = recentBadges.filter(b => !prev.find(p => p.id === b.id));
        return [...prev, ...newBadges].slice(-3); // Keep max 3 at a time
      });
      
      clearPopups();
    }
  }, [recentBadges, clearPopups]);

  // Auto remove badges after 5 seconds
  useEffect(() => {
    if (visibleBadges.length > 0) {
      const timer = setTimeout(() => {
        setVisibleBadges((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visibleBadges]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence>
        {visibleBadges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className="glitch-enter glass border border-primary/30 p-3 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-start gap-3 w-72"
          >
            <div className="p-2 rounded-lg bg-black/50 border border-border/50 shadow-inner">
              {getIcon(badge.icon)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-primary tracking-widest leading-none mb-1">
                Badge Unlocked
              </span>
              <span className="font-bold text-sm text-foreground">{badge.name}</span>
              <span className="text-xs text-muted-foreground mt-0.5 leading-tight">
                {badge.description}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
