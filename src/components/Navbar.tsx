  import { useState } from "react";
  import { Link } from "react-router-dom";
  import { motion, AnimatePresence } from "framer-motion";
  import { Menu, X, Gamepad2 } from "lucide-react";
  import { useGamification } from "../hooks/useGamification";
  import { LevelRing } from "./gamification/LevelRing";
  import { GamificationProfile } from "./gamification/GamificationProfile";

  const WHATSAPP_URL =
    "https://wa.me/56929810915?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

  const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // ✅ Gamificación intacta (NO modificar lógica interna)
    const { levelProgress } = useGamification();

    return (
      <>
        {/* ───────── NAVBAR ISLA CENTRADA ───────── */}
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-7xl h-20 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/60 flex items-center justify-between px-8 relative"
          >
            {/* Branding Izquierda */}
            <Link to="/" className="select-none">
              <h1 className="font-black tracking-tighter uppercase text-lg sm:text-xl md:text-2xl">
                <span className="text-foreground">ELECTRO</span>
                <span className="text-primary">
                  REPARA
                </span>
              </h1>
            </Link>

            {/* Derecha: Pokébola + Menú */}
            <div className="flex items-center gap-4">
              {/* ✅ Esto abre el Pokédex completo original */}
              <GamificationProfile>
                <div role="button">
                  <LevelRing />
                </div>
              </GamificationProfile>

              {/* Menú navegación */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:opacity-70 transition"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

            {/* XP BAR ORIGINAL */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40">
              <motion.div
                className="h-full xp-bar-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
              />
            </div>
          </motion.nav>
        </div>

        {/* ───────── OVERLAY SOLO NAVEGACIÓN ───────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0B0F19]/95 backdrop-blur-3xl z-[60] flex flex-col items-center justify-center px-6 text-center"
            >
              {/* Botón cerrar elegante */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={32} />
              </button>

              <div className="flex flex-col gap-14">
                <a
                  href="/#servicios"
                  onClick={() => setIsOpen(false)}
                  className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white hover:text-[#00E2FF] transition-colors"
                >
                  Servicios
                </a>

                <Link
                  to="/tutoriales"
                  onClick={() => setIsOpen(false)}
                  className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white hover:text-[#00E2FF] transition-colors"
                >
                  Tutoriales
                </Link>

                <Link
                  to="/magia"
                  onClick={() => setIsOpen(false)}
                  className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#00ffcc] hover:text-[#00ccaa] transition-colors"
                >
                  Magia Nintendo
                </Link>

                <Link
                  to="/retro-zone"
                  onClick={() => setIsOpen(false)}
                  className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white hover:text-[#00E2FF] transition-colors"
                >
                  Juega tus clásicos acá
                </Link>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white hover:text-[#00E2FF] transition-colors"
                >
                  Contactar
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───────── DESKTOP FLOATING RETRO TAB ───────── */}
        <motion.div
          whileHover={{ x: -10 }}
          className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40"
        >
          <Link
            to="/retro-zone"
            className="px-4 py-8 bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 font-semibold tracking-wide shadow-[0_0_20px_rgba(0,226,255,0.4)] animate-pulse"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Juega clásicos gratis 🕹️
          </Link>
        </motion.div>

        {/* ───────── MOBILE RETRO BAR ───────── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 12px rgba(34,211,238,0.4)",
                "0 0 28px rgba(34,211,238,0.75)",
                "0 0 12px rgba(34,211,238,0.4)",
              ],
            }}
          transition={{ repeat: Infinity, duration: 2 }}
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