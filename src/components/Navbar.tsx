import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Zap, Gamepad2 } from "lucide-react";
import { useGamification } from "../hooks/useGamification";
import { LevelRing } from "./gamification/LevelRing";
import { GamificationProfile } from "./gamification/GamificationProfile";

const WHATSAPP_URL = "https://wa.me/56929810915?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { levelProgress, stats, isAuthenticated, rankColor } = useGamification();

  return (
    <>
      {/* ── Navbar principal ─────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass-green border-b border-primary/10"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <Zap className="w-6 h-6 text-primary transition-all group-hover:drop-shadow-[0_0_8px_hsl(145,100%,45%)]" />
            <span className="text-lg font-bold text-foreground">
              Electro<span className="text-primary">Repara</span>
            </span>
          </a>

          {/* ═══ Desktop menu ═══ */}
          <div className="hidden md:flex items-center gap-8">
            <motion.div
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Link
                to="/retro-zone"
                className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400 transition-colors drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]"
              >
                <Gamepad2 className="w-4 h-4" />
                Retoma tu infancia acá ➔
              </Link>
            </motion.div>

            <>
              <a
                href="#servicios"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Servicios
              </a>
              <Link
                to="/tutoriales"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Tutoriales
              </Link>
            </>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:shadow-[0_0_20px_hsl(145,100%,45%,0.4)] transition-all"
            >
              Contactar
            </a>
            
            {/* Gamification Ring -> Opens Profile Dashboard (DESKTOP) */}
            <div className="ml-4 pl-4 border-l border-white/10">
              <GamificationProfile>
                <div role="button">
                  <LevelRing />
                </div>
              </GamificationProfile>
            </div>
          </div>

          {/* ═══ Mobile: LevelRing + Hamburger ═══ */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Level Ring (opens profile sheet) */}
            <GamificationProfile>
              <div role="button">
                <LevelRing />
              </div>
            </GamificationProfile>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ═══ Mobile dropdown menu ═══ */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden glass-green border-t border-primary/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4 pb-6">
              
              {/* Mini trainer card (mobile only) */}
              {isAuthenticated && stats.isProfileComplete && (
                <GamificationProfile>
                  <div role="button" className="flex items-center gap-3 bg-card/60 p-3 rounded-xl border border-border/50 active:scale-[0.98] transition-transform">
                    <div className="w-10 h-10 rounded-full border border-primary/40 overflow-hidden bg-gray-900 flex-shrink-0">
                      {stats.avatarUrl && <img src={stats.avatarUrl} alt="" className="w-full h-full object-contain" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-primary truncate">{stats.displayName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono" style={{ color: rankColor }}>
                        {stats.levelName} • {stats.xp}/{stats.nextLevelXP} EVs
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Ver Pokédex →</span>
                  </div>
                </GamificationProfile>
              )}

              {!isAuthenticated && (
                <GamificationProfile>
                  <div role="button" className="flex items-center gap-3 bg-card/60 p-3 rounded-xl border border-primary/30 active:scale-[0.98] transition-transform">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-600 overflow-hidden relative flex-shrink-0">
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600 -translate-y-1/2"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-yellow-400">¡Recibe un Pokémon gratis!</div>
                      <div className="text-[10px] text-muted-foreground">Inicia sesión para empezar tu aventura</div>
                    </div>
                  </div>
                </GamificationProfile>
              )}

              {/* Nav links */}
              <>
                <a
                  href="#servicios"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Servicios
                </a>
                <Link
                  to="/tutoriales"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tutoriales
                </Link>
              </>
              <Link
                to="/retro-zone"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 font-semibold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]"
              >
                <Gamepad2 className="w-4 h-4" />
                Retoma tu infancia acá ➔
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center"
              >
                Contactar
              </a>
            </div>
          </motion.div>
        )}
        {/* XP Bar (Bottom of navbar) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/40">
          <motion.div 
            className="h-full xp-bar-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        </div>
      </motion.nav>

      {/* ── Barra fija inferior SOLO mobile ──────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 12px rgba(34,211,238,0.4)",
              "0 0 28px rgba(34,211,238,0.75)",
              "0 0 12px rgba(34,211,238,0.4)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="rounded-2xl overflow-hidden"
        >
          <Link
            to="/retro-zone"
            className="flex items-center justify-center gap-3 w-full py-4 bg-cyan-400 text-black font-black text-sm tracking-wider"
          >
            <Gamepad2 className="w-5 h-5" />
            🎮 RETOMA TU INFANCIA ACÁ →
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;