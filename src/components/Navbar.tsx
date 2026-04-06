import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/56912345678?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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

        <div className="hidden md:flex items-center gap-8">
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

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass-green border-t border-primary/10"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
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
  );
};

export default Navbar;
