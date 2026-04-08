import { createContext, useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, signInWithGoogle, signOut as fbSignOut } from "../lib/firebase";
import { checkEvolution, playPokemonCry, playUISound } from "../lib/pokeapi";

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
  { level: 0, name: "Entrenador Novato",   minXP: 0,   nextXP: 10   },
  { level: 1, name: "Líder de Gimnasio",   minXP: 10,  nextXP: 25   },
  { level: 2, name: "Alto Mando",          minXP: 25,  nextXP: 50   },
  { level: 3, name: "Campeón Regional",    minXP: 50,  nextXP: 100  },
  { level: 4, name: "Maestro Pokémon",     minXP: 100, nextXP: 9999 },
];

export const ALL_BADGES: Badge[] = [
  { id: "first-visit",    name: "Primer Contacto",   description: "Visitaste ElectroRepara",          icon: "Zap",          unlockedAt: 0  },
  { id: "whatsapp-hero",  name: "WhatsApp Hero",     description: "Contactaste por WhatsApp",         icon: "MessageCircle", unlockedAt: 5  },
  { id: "explorer",       name: "Service Explorer",  description: "Exploraste todos los servicios",   icon: "Search",        unlockedAt: 8  },
  { id: "circuit-rider",  name: "Circuit Rider",     description: "Alcanzaste nivel Circuit Breaker", icon: "Cpu",           unlockedAt: 10 },
  { id: "retro-gamer",    name: "Retro Gamer",       description: "Visitaste la Retro Zone",          icon: "Gamepad2",      unlockedAt: 12 },
  { id: "logic-lord",     name: "Logic Lord",        description: "Alcanzaste nivel Logic Master",    icon: "BrainCircuit",  unlockedAt: 25 },
  { id: "antigravity",    name: "Antigravity",       description: "Máximo rango alcanzado",           icon: "Rocket",        unlockedAt: 50 },
  { id: "hacker",         name: "Konami Hacker",     description: "Encontraste el código secreto",    icon: "Skull",         unlockedAt: -1 },
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
  phone: "",
};

// ─── SCOPED localStorage helpers ──────────────────────────────────────────────
// Each user gets their OWN key so different accounts never share cached data.
const lsKey = (uid: string) => `er-gamify-${uid}`;

const loadFromLS = (uid: string): Partial<UserStats> | null => {
  try {
    const raw = localStorage.getItem(lsKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveToLS = (uid: string, stats: UserStats) => {
  try {
    localStorage.setItem(lsKey(uid), JSON.stringify(stats));
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
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

  // ─── FIX: Use a ref for userId so callbacks always get the LATEST value ────
  // This eliminates the stale closure bug where persistStats used an old userId.
  const userIdRef = useRef<string | null>(null);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // ─── Firebase Auth listener ────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        userIdRef.current = user.uid;

        console.log("[Auth] User signed in:", user.uid, user.email);

        try {
          const docRef = doc(db, "gamification", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // ── User exists in Firestore → load their data ──
            const stored = docSnap.data() as Partial<UserStats>;
            const merged = { ...DEFAULT_STATS, ...stored };
            setStats(merged);
            // Sync localStorage for this specific user
            saveToLS(user.uid, merged as UserStats);
            console.log("[Firestore] Loaded existing user data:", user.uid);
          } else {
            // ── New user → try localStorage fallback (same UID), then create ──
            const lsFallback = loadFromLS(user.uid);
            const newStats: UserStats = {
              ...DEFAULT_STATS,
              ...lsFallback, // will be null-safe since spread of null is ignored
              displayName: user.displayName || lsFallback?.displayName || "Entrenador",
              avatarUrl: user.photoURL || lsFallback?.avatarUrl || "",
            };

            await setDoc(docRef, newStats);
            setStats(newStats);
            saveToLS(user.uid, newStats);
            console.log("[Firestore] Created new user document:", user.uid);
          }
        } catch (error) {
          console.error("[Firestore] Read error for user", user.uid, error);
          // FIX: Fallback is SCOPED to THIS user's UID, never leaks other user data
          const lsFallback = loadFromLS(user.uid);
          if (lsFallback) {
            console.warn("[Auth] Firestore failed, using scoped localStorage for", user.uid);
            setStats({ ...DEFAULT_STATS, ...lsFallback });
          } else {
            setStats({ ...DEFAULT_STATS, displayName: user.displayName || "Entrenador" });
          }
        }
      } else {
        // ── Signed out ──
        console.log("[Auth] User signed out — clearing state");
        setUserId(null);
        userIdRef.current = null;
        setStats(DEFAULT_STATS);
        setActionHistory({});
        // NOTE: We deliberately do NOT clear localStorage here.
        // Each user's localStorage is scoped to their UID, so there's no contamination.
      }
    });

    return () => unsubscribe();
  }, []);

  // ─── Persist to Firestore + scoped localStorage ───────────────────────────
  // Uses userIdRef.current so it always has the real current UID (no stale closure).
  const persistStats = useCallback(async (newStats: UserStats) => {
    const uid = userIdRef.current;
    if (!uid) return;

    setStats(newStats);
    // Always write to scoped localStorage as fast backup
    saveToLS(uid, newStats);

    // Write to Firestore — setDoc with merge is atomic create-or-update
    try {
      const docRef = doc(db, "gamification", uid);
      await setDoc(docRef, newStats, { merge: true });
    } catch (error) {
      console.error("[Firestore] Write error:", error);
      // Data is safe in scoped localStorage — will sync next time
    }
  }, []); // No [userId] dependency — uses ref instead

  // ─── Add XP ───────────────────────────────────────────────────────────────
  const addXP = useCallback(
    (amount: number, reason: string) => {
      if (!userIdRef.current) return; // Must be logged in

      const now = Date.now();
      const lastTime = actionHistory[reason] || 0;

      // Anti-spam cooldown
      if (now - lastTime < COOLDOWN_MS && reason !== "konami-code") return;

      setActionHistory((prev) => ({ ...prev, [reason]: now }));

      setStats((prev) => {
        let newXp = prev.xp + amount;
        let newLevel = prev.level;
        let newLevelName = prev.levelName;
        let newNextXP = prev.nextLevelXP;
        let didLevelUp = false;

        // Level up logic
        const nextRank = RANKS.find((r) => r.level === newLevel + 1);
        if (nextRank && newXp >= nextRank.minXP) {
          newLevel = nextRank.level;
          newLevelName = nextRank.name;
          newNextXP = nextRank.nextXP;
          didLevelUp = true;
          setRecentLevelUp(true);
          playUISound("levelup", 0.4);
        }

        // Badge logic
        const unlockedBadges: Badge[] = [];
        const newBadgeIds = [...prev.badges];

        if (reason === "konami-code" && !newBadgeIds.includes("hacker")) {
          const hackerBadge = ALL_BADGES.find((b) => b.id === "hacker")!;
          unlockedBadges.push(hackerBadge);
          newBadgeIds.push("hacker");
        }

        ALL_BADGES.forEach((badge) => {
          if (badge.unlockedAt >= 0 && newXp >= badge.unlockedAt && !newBadgeIds.includes(badge.id)) {
            unlockedBadges.push(badge);
            newBadgeIds.push(badge.id);
          }
        });

        if (unlockedBadges.length > 0) {
          setRecentBadges((prevBadges) => [...prevBadges, ...unlockedBadges]);
          playUISound("badge", 0.3);
        }

        const newStats: UserStats = {
          ...prev,
          xp: newXp,
          level: newLevel,
          levelName: newLevelName,
          nextLevelXP: newNextXP,
          badges: newBadgeIds,
        };

        // Fire and forget persist (safe because persistStats uses ref, not closure)
        persistStats(newStats);

        if (amount > 0 && !didLevelUp) playUISound("xp", 0.2);

        return newStats;
      });
    },
    [actionHistory, persistStats]
  );

  // ─── Update profile (Pokemon + name) ──────────────────────────────────────
  const updateProfile = useCallback(
    (displayName: string, pokemonId: number | null) => {
      setStats((prev) => {
        const newStats = { ...prev, displayName, pokemonId };
        persistStats(newStats);
        return newStats;
      });
    },
    [persistStats]
  );

  // ─── Save full profile (onboarding completion) ─────────────────────────────
  const saveFullProfile = useCallback(
    async (data: Partial<UserStats>) => {
      const uid = userIdRef.current;
      if (!uid) return;

      // Build from current stats in state
      setStats((prev) => {
        const newStats: UserStats = { ...prev, ...data, isProfileComplete: true };
        // Persist immediately using the ref-based function
        persistStats(newStats);
        return newStats;
      });
    },
    [persistStats]
  );

  // ─── Evolution trigger ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!userIdRef.current) return; // Don't run if not logged in
    if (stats.pokemonId && stats.level > 0) {
      checkEvolution(stats.pokemonId, stats.level).then((evolvedId) => {
        if (evolvedId && evolvedId !== stats.pokemonId) {
          playPokemonCry(evolvedId, 0.5);
          updateProfile(stats.displayName, evolvedId);
        }
      });
    }
  }, [stats.level]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auth actions ──────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    // Clear in-memory state BEFORE signing out to avoid flickers
    setStats(DEFAULT_STATS);
    setActionHistory({});
    setRecentBadges([]);
    setRecentLevelUp(false);
    await fbSignOut();
  };

  const clearPopups = useCallback(() => {
    setRecentBadges([]);
    setRecentLevelUp(false);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        stats,
        addXP,
        updateProfile,
        saveFullProfile,
        loginWithGoogle,
        logout,
        isAuthenticated: !!userId,
        recentBadges,
        recentLevelUp,
        clearPopups,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};
