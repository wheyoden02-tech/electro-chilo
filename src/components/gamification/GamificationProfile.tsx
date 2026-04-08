import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useGamification } from "../../hooks/useGamification";
import { ALL_BADGES } from "../../context/UserStatsContext";
import { fetchPokemonData, playPokemonCry } from "../../lib/pokeapi";
import { Zap, Trophy, Lock, LogIn, LogOut, MapPin, Gamepad2, MessageCircle, Search, Cpu, BrainCircuit, Rocket, Skull, Medal } from "lucide-react";
import { type LucideProps } from "lucide-react";

// BUG-03 FIX: Map badge.icon string → actual Lucide component
const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Zap, MessageCircle, Search, Cpu, Gamepad2, BrainCircuit, Rocket, Skull, Medal, Trophy,
};

import { motion } from "framer-motion";

export const GamificationProfile = ({ children }: { children: React.ReactNode }) => {
  const { stats, levelProgress, rankColor, loginWithGoogle, logout, isAuthenticated } = useGamification();
  const [pokemonData, setPokemonData] = useState<any>(null);

  // Load selected pokemon data
  useEffect(() => {
    if (stats.pokemonId) {
      fetchPokemonData(stats.pokemonId).then(setPokemonData).catch(console.error);
    } else {
      setPokemonData(null);
    }
  }, [stats.pokemonId]);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md border-l border-primary/20 bg-background/95 backdrop-blur-xl overflow-y-auto pb-24">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-xl font-bold font-mono tracking-widest uppercase text-center mt-4 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
              Pokédex de Entrenador
            </SheetTitle>
          </SheetHeader>

          {/* ─── NOT LOGGED IN ─── */}
          {!isAuthenticated && (
            <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
              {/* Pokeball icon */}
              <div className="w-20 h-20 rounded-full border-4 border-gray-700 overflow-hidden relative shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-700 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-700 rounded-full"></div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">¡Conviértete en Entrenador!</h3>
                <p className="text-xs text-muted-foreground max-w-[260px] mx-auto mb-6">
                  Inicia sesión con Google para recibir un Pokémon compañero gratis, ganar puntos de experiencia y subir de nivel.
                </p>
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg mx-auto text-sm"
                >
                  <LogIn size={18} /> Iniciar Sesión con Google
                </button>
              </div>
            </div>
          )}

          {/* ─── LOGGED IN: FULL PROFILE ─── */}
          {isAuthenticated && (
            <div className="flex flex-col gap-6">

              {/* ── TRAINER IDENTITY ── */}
              <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <div className="w-16 h-16 rounded-full border-2 border-primary/50 flex-shrink-0 overflow-hidden bg-gray-900 shadow-[0_0_12px_rgba(0,255,255,0.2)]">
                  {stats.avatarUrl ? (
                    <img src={stats.avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">?</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-primary truncate">{stats.displayName}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={10} /> {stats.city || "Sin ciudad"}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Gamepad2 size={10} /> {stats.consoles || "Sin consolas"}
                  </div>
                </div>
              </div>

              {/* ── POKEMON MASCOT ── */}
              {pokemonData ? (
                <div className="flex flex-col items-center gap-3 bg-card/40 p-5 rounded-xl border border-border">
                  <div
                    className="relative w-28 h-28 rounded-full border-2 flex items-center justify-center bg-card cursor-pointer hover:scale-105 transition-transform"
                    style={{ borderColor: rankColor, boxShadow: `0 0 20px ${rankColor}30` }}
                    onClick={() => stats.pokemonId && playPokemonCry(stats.pokemonId, 0.5)}
                    title="¡Haz clic para escuchar su grito!"
                  >
                    <motion.img
                      src={pokemonData.sprite}
                      alt={pokemonData.name}
                      className="w-20 h-20 object-contain z-10 pixelated drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Compañero</div>
                    <div className="font-bold text-xl font-mono uppercase bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
                      {pokemonData.name}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic mt-1 px-4 max-w-[280px]">
                      "{pokemonData.lore}"
                    </p>
                  </div>

                  {/* Stats bars */}
                  <div className="w-full space-y-1.5 mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-8 font-mono text-green-400 font-bold">HP</span>
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, pokemonData.stats.hp)}%` }}></div>
                      </div>
                      <span className="w-6 text-right font-mono text-green-400">{pokemonData.stats.hp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-8 font-mono text-red-400 font-bold">ATK</span>
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, pokemonData.stats.attack)}%` }}></div>
                      </div>
                      <span className="w-6 text-right font-mono text-red-400">{pokemonData.stats.attack}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-8 font-mono text-blue-400 font-bold">DEF</span>
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, pokemonData.stats.defense)}%` }}></div>
                      </div>
                      <span className="w-6 text-right font-mono text-blue-400">{pokemonData.stats.defense}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">Cargando datos del Pokémon...</div>
              )}

              {/* ── XP PROGRESS ── */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end font-mono">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Nivel {stats.level + 1}</span>
                    <span className="font-bold text-base" style={{ color: rankColor }}>
                      {stats.levelName}
                    </span>
                  </div>
                  <div className="text-xs text-right">
                    <span className="text-foreground font-bold">{stats.xp}</span>
                    <span className="text-muted-foreground"> / {stats.nextLevelXP} EVs</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-border/50">
                  <motion.div
                    className="h-full xp-bar-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                  Gana EVs cotizando por WhatsApp, explorando servicios y completando desafíos.
                </p>
              </div>

              {/* ── BADGES / MEDALS ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Trophy size={16} className="text-yellow-500" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Medallas de Gimnasio</h3>
                  <span className="ml-auto text-xs font-mono bg-card px-2 py-0.5 rounded border">
                    {stats.badges.length} / {ALL_BADGES.length}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {ALL_BADGES.map((badge) => {
                    const unlocked = stats.badges.includes(badge.id);
                    if (!unlocked && badge.unlockedAt < 0) return null;

                    return (
                      <div
                        key={badge.id}
                        title={`${badge.name}: ${badge.description}`}
                        className={`
                          relative aspect-square flex flex-col items-center justify-center p-2 rounded-xl border transition-all
                          ${unlocked
                            ? "bg-primary/10 border-primary/40 shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:scale-105 cursor-help"
                            : "bg-background border-border/30 opacity-40 grayscale"}
                        `}
                      >
                        {unlocked ? (
                          <>
                            {(() => {
                              const Icon = ICON_MAP[badge.icon] || Zap;
                              return <Icon size={22} className="text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]" />;
                            })()}
                            <span className="absolute -bottom-1 -right-1 text-[8px] bg-primary text-black font-bold px-1 rounded-sm">✓</span>
                          </>
                        ) : (
                          <Lock size={18} className="text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── HOW TO EARN XP ── */}
              <div className="bg-card/30 p-3 rounded-lg border border-border/30">
                <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase mb-2">¿Cómo ganar EVs?</h4>
                <ul className="text-[10px] text-muted-foreground space-y-1">
                  <li>⚡ <strong>+5 EVs</strong> — Cotizar por WhatsApp</li>
                  <li>🔍 <strong>+2 EVs</strong> — Explorar secciones de la web</li>
                  <li>🎮 <strong>+3 EVs</strong> — Visitar la Retro Zone</li>
                  <li>🔑 <strong>+10 EVs</strong> — Encontrar el código secreto</li>
                  <li>📚 <strong>+EVs</strong> — Completar guías y tutoriales (próximamente)</li>
                </ul>
              </div>

              {/* ── LOGOUT ── */}
              <div className="pt-4 border-t border-border flex justify-center">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/30"
                >
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
