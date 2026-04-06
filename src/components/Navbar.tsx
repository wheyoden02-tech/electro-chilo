import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Zap, Gamepad2 } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/56929810915?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

          {/* Desktop menu */}
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

            {["Servicios", "Nosotros", "Casos de Éxito"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:shadow-[0_0_20px_hsl(145,100%,45%,0.4)] transition-all"
            >
              Contactar
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden glass-green border-t border-primary/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4 pb-6">
              {["Servicios", "Nosotros", "Casos de Éxito"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
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