import { motion } from "framer-motion";
import { ArrowRight, Cpu } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/56912345678?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
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

          {/* Right - GSAP placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div
              id="gsap-hero-container"
              className="relative w-full aspect-square max-w-lg rounded-2xl border border-border/50 bg-card/30 flex items-center justify-center overflow-hidden"
            >
              {/* Animated placeholder */}
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex flex-col items-center gap-4"
              >
                <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 neon-glow-green">
                  <Cpu className="w-16 h-16 text-primary" />
                </div>
                <p className="text-xs font-mono text-muted-foreground text-center">
                  // GSAP Animation Slot<br />
                  // Nintendo Switch Teardown
                </p>
              </motion.div>
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
