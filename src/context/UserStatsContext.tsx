import { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, signInWithGoogle, signOut as fbSignOut } from "../lib/firebase";
import { getRandomStarter, checkEvolution, playPokemonCry, playUISound } from "../lib/pokeapi";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
}

export interface UserStats {
  xp: number;
  level: number;
  levelName: string;
  nextLevelXP: number;
  badges: string[]; // only store badge IDs
  displayName: string;
  pokemonId: number | null;
  isProfileComplete: boolean;
  avatarUrl: string;
  city: string;
  consoles: string;
  phone: string;
}

interface GamificationContextType {
  stats: UserStats;
  addXP: (amount: number, reason: string) => void;
  updateProfile: (displayName: string, pokemonId: number | null) => void;
  saveFullProfile: (data: Partial<UserStats>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  recentBadges: Badge[];
  recentLevelUp: boolean;
  clearPopups: () => void;
}

const RANKS = [
  { level: 0, name: "Entrenador Novato",   minXP: 0,  nextXP: 10 },
  { level: 1, name: "Líder de Gimnasio",   minXP: 10, nextXP: 25 },
  { level: 2, name: "Alto Mando",          minXP: 25, nextXP: 50 },
  { level: 3, name: "Campeón Regional",    minXP: 50, nextXP: 100 },
  { level: 4, name: "Maestro Pokémon",     minXP: 100, nextXP: 9999 },
];

export const ALL_BADGES: Badge[] = [
  { id: "first-visit",    name: "Primer Contacto",   description: "Visitaste ElectroRepara",          icon: "Zap",        unlockedAt: 0  },
  { id: "whatsapp-hero",  name: "WhatsApp Hero",     description: "Contactaste por WhatsApp",         icon: "MessageCircle", unlockedAt: 5  },
  { id: "explorer",       name: "Service Explorer",  description: "Exploraste todos los servicios",   icon: "Search",     unlockedAt: 8  },
  { id: "circuit-rider",  name: "Circuit Rider",     description: "Alcanzaste nivel Circuit Breaker", icon: "Cpu",        unlockedAt: 10 },
  { id: "retro-gamer",    name: "Retro Gamer",       description: "Visitaste la Retro Zone",          icon: "Gamepad2",   unlockedAt: 12 },
  { id: "logic-lord",     name: "Logic Lord",        description: "Alcanzaste nivel Logic Master",    icon: "BrainCircuit", unlockedAt: 25 },
  { id: "antigravity",    name: "Antigravity",       description: "Máximo rango alcanzado",           icon: "Rocket",     unlockedAt: 50 },
  { id: "hacker",         name: "Konami Hacker",     description: "Encontraste el código secreto",    icon: "Skull",      unlockedAt: -1 }, // Secret
];

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 0,
  levelName: RANKS[0].name,
  nextLevelXP: RANKS[0].nextXP,
  badges: [],
  displayName: "Invitado",
  pokemonId: null,
  isProfileComplete: false,
  avatarUrl: "",
  city: "",
  consoles: "",
  phone: ""
};

const COOLDOWN_MS = 30000; // 30 seconds cooldown per action

export const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [userId, setUserId] = useState<string | null>(null);
  const [actionHistory, setActionHistory] = useState<Record<string, number>>({});
  
  // Popups state
  const [recentBadges, setRecentBadges] = useState<Badge[]>([]);
  const [recentLevelUp, setRecentLevelUp] = useState(false);

  // Initialize Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Load stats from Firestore
        try {
          const docRef = doc(db, "gamification", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // Merge with defaults so new fields are always present
            const stored = docSnap.data() as Partial<UserStats>;
            setStats({ ...DEFAULT_STATS, ...stored });
          } else {
            // New user in Firestore — create document immediately
            const newStats = { ...DEFAULT_STATS, displayName: user.displayName || "Entrenador" };
            await setDoc(docRef, newStats);
            setStats(newStats);
          }
        } catch (error) {
          console.error("Firestore read error:", error);
          // Try localStorage fallback before giving up
          const cached = localStorage.getItem("er-gamify-stats");
          if (cached) {
            try {
              setStats({ ...DEFAULT_STATS, ...JSON.parse(cached) });
            } catch {
              setStats(DEFAULT_STATS);
            }
          } else {
            setStats(DEFAULT_STATS);
          }
        }
      } else {
        setUserId(null);
        setStats(DEFAULT_STATS); // Wipe any guest data, no play without login
      }
    });

    return () => unsubscribe();
  }, []);

  const persistStats = useCallback(
    async (newStats: UserStats) => {
      setStats(newStats);
      // LocalStorage backup (always write, acts as safety net)
      localStorage.setItem("er-gamify-stats", JSON.stringify(newStats));

      // Firebase priority — use setDoc with merge to create-or-update atomically
      // This eliminates the race condition of getDoc + updateDoc
      if (userId) {
        try {
          const docRef = doc(db, "gamification", userId);
          await setDoc(docRef, newStats, { merge: true });
        } catch (error) {
          console.error("Firestore update error:", error);
        }
      }
    },
    [userId]
  );

  const addXP = useCallback(
    (amount: number, reason: string) => {
      // Must be logged in to gain XP
      if (!userId) return;

      const now = Date.now();
      const lastTime = actionHistory[reason] || 0;

      // Anti-spam
      if (now - lastTime < COOLDOWN_MS && reason !== "konami-code") {
        return; // Too soon for this specific action
      }

      setActionHistory((prev) => ({ ...prev, [reason]: now }));

      setStats((prev) => {
        let newXp = prev.xp + amount;
        let newLevel = prev.level;
        let newLevelName = prev.levelName;
        let newNextXP = prev.nextLevelXP;
        let didLevelUp = false;

        // Level Up Logic
        const nextRank = RANKS.find((r) => r.level === newLevel + 1);
        if (nextRank && newXp >= nextRank.minXP) {
          newLevel = nextRank.level;
          newLevelName = nextRank.name;
          newNextXP = nextRank.nextXP;
          didLevelUp = true;
          setRecentLevelUp(true);
          playUISound("levelup", 0.4);
        }

        // Badges Logic
        const unlockedBadges: Badge[] = [];
        const newBadgeIds = [...prev.badges];

        // Specific reason badge (Easter egg)
        if (reason === "konami-code" && !newBadgeIds.includes("hacker")) {
          const hackerBadge = ALL_BADGES.find((b) => b.id === "hacker")!;
          unlockedBadges.push(hackerBadge);
          newBadgeIds.push("hacker");
        }

        // XP thresholds badges
        ALL_BADGES.forEach((badge) => {
          if (
            badge.unlockedAt >= 0 &&
            newXp >= badge.unlockedAt &&
            !newBadgeIds.includes(badge.id)
          ) {
            unlockedBadges.push(badge);
            newBadgeIds.push(badge.id);
          }
        });

        if (unlockedBadges.length > 0) {
          setRecentBadges((prevBadges) => [...prevBadges, ...unlockedBadges]);
          playUISound("badge", 0.3);
        }

        const newStats = {
          xp: newXp,
          level: newLevel,
          levelName: newLevelName,
          nextLevelXP: newNextXP,
          badges: newBadgeIds,
          displayName: prev.displayName,
          pokemonId: prev.pokemonId,
          isProfileComplete: prev.isProfileComplete,
          avatarUrl: prev.avatarUrl,
          city: prev.city,
          consoles: prev.consoles,
          phone: prev.phone
        };

        // Fire & Forget persist
        persistStats(newStats);

        // XP gain sound (only if actual XP was added)
        if (amount > 0 && !didLevelUp) {
          playUISound("xp", 0.2);
        }

        return newStats;
      });
    },
    [actionHistory, persistStats]
  );

  const updateProfile = useCallback((displayName: string, pokemonId: number | null) => {
    setStats((prev) => {
      const newStats = { ...prev, displayName, pokemonId };
      persistStats(newStats);
      return newStats;
    });
  }, [persistStats]);

  const saveFullProfile = useCallback(async (data: Partial<UserStats>) => {
    const newStats = { ...stats, ...data, isProfileComplete: true } as UserStats;
    // Use persistStats which handles setDoc with merge + localStorage backup
    await persistStats(newStats);
  }, [stats, persistStats]);

  // Evolution trigger check
  useEffect(() => {
    if (stats.pokemonId && stats.level > 0) {
      checkEvolution(stats.pokemonId, stats.level).then((evolvedId) => {
        if (evolvedId && evolvedId !== stats.pokemonId) {
          // Play evolution cry!
          playPokemonCry(evolvedId, 0.5);
          updateProfile(stats.displayName, evolvedId);
        }
      });
    }
  }, [stats.level]); // Only run when level changes

  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await fbSignOut();
    setStats(DEFAULT_STATS);
  };

  const clearPopups = useCallback(() => {
    setRecentBadges([]);
    setRecentLevelUp(false);
  }, []);

  return (
    <GamificationContext.Provider value={{ 
      stats, addXP, updateProfile, saveFullProfile, loginWithGoogle, logout, isAuthenticated: !!userId,
      recentBadges, recentLevelUp, clearPopups 
    }}>
      {children}
    </GamificationContext.Provider>
  );
};
