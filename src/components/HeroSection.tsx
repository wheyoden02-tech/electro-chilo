import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/56929810915?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* FULL VIDEO BACKGROUND */}
      <video
        src="/gameplay-switch.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute inset-0 w-full h-full
          object-contain
          md:object-cover
          transition-all duration-500
        "
      />

      {/* CRT SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_1px,transparent_1px,transparent_3px)]" />

      {/* DARK OVERLAY FOR LEGIBILITY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* SHINGLE PATTERN */}
      <div className="absolute inset-0 shingle-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scan-line pointer-events-none" />

      {/* FUTURISTIC SYSTEM - FULLSCREEN */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          className="absolute w-[140vw] h-[140vw] max-w-[1600px] max-h-[1600px] border border-primary/20 rounded-full"
        />

        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="absolute w-[90vw] h-[90vw] max-w-[1100px] max-h-[1100px] border border-accent/25 rounded-full"
        />

        {/* Glow pulse */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute w-[110vw] h-[110vw] max-w-[1300px] max-h-[1300px] bg-primary/10 blur-3xl rounded-full"
        />
      </div>

      {/* CONTENT ABOVE EVERYTHING */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-xs font-mono text-primary">
                SERVICIO TÉCNICO CERTIFICADO
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 palafito-title-glow text-white">
              Especialistas en{" "}
              <span className="text-gradient-neon">revivir tu tecnología</span>{" "}
              en Chiloé
            </h1>

            {/* Description */}
            <p className="text-lg text-platinum max-w-lg mb-8 leading-relaxed">
              Reparación profesional de{" "}
              <strong className="text-white">iPhone</strong>,{" "}
              <strong className="text-white">Nintendo Switch</strong>,{" "}
              <strong className="text-white">consolas</strong> y{" "}
              <strong className="text-white">computadores</strong>. Servicio
              técnico de microelectrónica en Castro.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pulse-whatsapp inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_35px_hsl(145,100%,45%,0.6)] transition-all"
              >
                Solicitar Cotización
                <ArrowRight size={18} />
              </a>

              <a
                href="#servicios"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white hover:border-accent hover:text-accent transition-all backdrop-blur-xs"
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
                  <div className="text-2xl font-bold text-gradient-neon">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;