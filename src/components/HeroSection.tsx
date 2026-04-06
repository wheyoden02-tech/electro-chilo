import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import switchHero from "@/assets/nintendo-switch-hero.png";

const WHATSAPP_URL = "https://wa.me/56912345678?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Shingle circuit background */}
      <div className="absolute inset-0 shingle-pattern" />
      <div className="absolute inset-0 scan-line pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-xs font-mono text-primary">SERVICIO TÉCNICO CERTIFICADO</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 palafito-title-glow">
              Especialistas en{" "}
              <span className="text-gradient-neon">revivir tu tecnología</span>{" "}
              en Chiloé
            </h1>

            <p className="text-lg text-platinum max-w-lg mb-8 leading-relaxed">
              Reparación profesional de <strong className="text-foreground">iPhone</strong>,{" "}
              <strong className="text-foreground">Nintendo Switch</strong>,{" "}
              <strong className="text-foreground">consolas</strong> y{" "}
              <strong className="text-foreground">computadores</strong>. Servicio técnico de microelectrónica en Castro.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pulse-whatsapp inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_30px_hsl(145,100%,45%,0.5)] transition-all"
              >
                Solicitar Cotización
                <ArrowRight size={18} />
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground hover:border-accent hover:text-accent transition-all"
              >
                Ver Servicios
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: "500+", label: "Reparaciones" },
                { value: "98%", label: "Satisfacción" },
                { value: "24h", label: "Respuesta" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gradient-neon">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Exploded layout placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div
              id="hero-exploded-layout"
              className="relative w-full aspect-square max-w-lg rounded-2xl border border-border/50 bg-card/30 flex items-center justify-center overflow-hidden"
            >
              {/* Shingle pattern overlay */}
              <div className="absolute inset-0 shingle-pattern opacity-30" />

              {/* Exploded component layout */}
              <div className="relative z-10 flex flex-col items-center gap-6 p-8">
                {/* Main device image */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <img
                    src={switchHero}
                    alt="Nintendo Switch - Servicio técnico especializado"
                    className="w-72 rounded-lg opacity-90"
                    style={{
                      filter: "drop-shadow(0 0 30px hsl(185 100% 50% / 0.2))",
                    }}
                  />
                </motion.div>

                {/* Exploded component labels */}
                <div className="flex justify-between w-full px-4">
                  {["Joy-Con L", "Mainboard", "Joy-Con R"].map((part, i) => (
                    <motion.div
                      key={part}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`w-2 h-2 rounded-full ${i === 1 ? "bg-primary" : "bg-accent"}`} />
                      <span className="text-[10px] font-mono text-muted-foreground">{part}</span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[10px] font-mono text-muted-foreground/60 text-center">
                  // TEARDOWN PRECISION × PALAFITO CRAFT
                </p>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
