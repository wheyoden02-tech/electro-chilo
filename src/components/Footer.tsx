"use client";

import { motion } from "framer-motion";

const WHATSAPP = "https://wa.me/56929810915";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-border/40 pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* --- Anti Santiago Section --- */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              TU TECNOLOGÍA NO NECESITA <br />
              <span className="italic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                VIAJAR A SANTIAGO
              </span>
            </h2>

            <p className="text-lg md:text-xl text-foreground font-semibold mb-6">
              Lo que otros envían a la capital, nosotros lo resolvemos aquí.
            </p>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Diagnóstico avanzado, micro‑soldadura profesional y reparación de
              consolas de última generación, sin riesgos de envío ni semanas de espera.
              En Castro y Valdivia trabajas directamente con el técnico, sin intermediarios.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 text-sm md:text-base">
              <span className="px-4 py-2 rounded-full bg-card/60 border border-border/50">
                ✅ Atención directa con el técnico
              </span>
              <span className="px-4 py-2 rounded-full bg-card/60 border border-border/50">
                ✅ Diagnóstico real y profesional
              </span>
              <span className="px-4 py-2 rounded-full bg-card/60 border border-border/50">
                ✅ Repuestos de calidad garantizada
              </span>
            </div>

            <div className="mt-10">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
              >
                Hablar con el experto
              </a>
            </div>
          </motion.div>
        </div>

        {/* --- Startup Style Footer --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-border/40 pt-12">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              ElectroRepara
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Especialistas en iPhone y consolas de última generación.
              Tecnología avanzada desde el Archipiélago.
            </p>
            <p className="text-muted-foreground text-sm mt-4">
              Castro, Chiloé · Chile - Valdivia, Los Ríos · Chile
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Servicios
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>Reparación iPhone</li>
              <li>Nintendo Switch</li>
              <li>PS5 & Xbox Series</li>
              <li>Diagnóstico electrónico</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  WhatsApp directo
                </a>
              </li>
              <li>Atención con cita previa</li>
              <li>Lunes a Sábado</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          © {currentYear} ElectroRepara · Tecnología avanzada sin intermediarios
        </div>
      </div>
    </footer>
  );
};

export default Footer;