"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Gamepad2,
  Laptop,
  ShieldCheck,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_BASE = "https://wa.me/56929810915";

const contactOptions = [
  {
    title: "Micro-cirugía iPhone",
    desc: "Placa base y trasplante de IC",
    icon: Smartphone,
    color: "text-blue-400",
    glow: "hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.45)]",
    bgGlow: "bg-blue-400/10",
    msg: "Hola, necesito una cotización para una reparación de placa/micro-soldadura en mi equipo Apple.",
  },
  {
    title: "Sistemas Nintendo",
    desc: "Magia, mantención y Joy-Con",
    icon: Gamepad2,
    color: "text-red-400",
    glow: "hover:shadow-[0_10px_30px_-10px_rgba(248,113,113,0.45)]",
    bgGlow: "bg-red-400/10",
    msg: "Hola, me interesa el servicio de sistema dual y catálogo para mi Nintendo Switch.",
  },
  {
    title: "Upgrade & Rescate PC",
    desc: "Recuperación de datos y potencia",
    icon: Laptop,
    color: "text-emerald-400",
    glow: "hover:shadow-[0_10px_30px_-10px_rgba(52,211,153,0.45)]",
    bgGlow: "bg-emerald-400/10",
    msg: "Hola, mi computador está lento o necesito recuperar archivos de un disco dañado.",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0B0F19] border-t border-white/5 pt-24 pb-10 overflow-hidden">
      {/* Núcleo Luminoso Inferior */}
      <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(0,226,255,0.2)_0%,rgba(168,85,247,0.15)_40%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Gancho Anti-Santiago */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              TU TECNOLOGÍA NO NECESITA <br />
              <span className="italic bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-glow-pulse">
                VIAJAR A SANTIAGO
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Evita riesgos de envío y esperas de semanas. En el corazón de{" "}
              <span className="text-white font-bold">Castro</span>, realizamos la
              micro-cirugía electrónica que otros solo ofrecen en la capital.
            </p>
          </motion.div>
        </div>

        {/* Tarjetas con Profundidad 3D */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {contactOptions.map((opt) => (
            <motion.a
              key={opt.title}
              href={`${WHATSAPP_BASE}?text=${encodeURIComponent(opt.msg)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className={cn(
                "group relative p-6 rounded-2xl",
                "bg-gradient-to-br from-white/10 to-transparent",
                "border border-white/10 border-t-white/20",
                "shadow-lg transition-all duration-300",
                "hover:-translate-y-2",
                opt.glow
              )}
            >
              <div>
                {/* Ícono con halo */}
                <div className="relative mb-5">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full blur-xl",
                      opt.bgGlow
                    )}
                  />
                  <div
                    className={cn(
                      "relative w-12 h-12 rounded-full flex items-center justify-center",
                      opt.bgGlow
                    )}
                  >
                    <opt.icon
                      className={cn(
                        "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                        opt.color
                      )}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-1 text-white">
                  {opt.title}
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {opt.desc}
                </p>
              </div>

              {/* CTA Interno */}
              <div className="mt-10 flex items-center gap-2 text-sm font-mono text-cyan-400 opacity-50 group-hover:opacity-100 transition-all duration-300">
                <span className="flex items-center">
                  INICIAR CONSULTA
                </span>
                <ChevronRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Botón Autoridad Técnica */}
        <div className="flex justify-center mb-14">
          <motion.a
            href={`${WHATSAPP_BASE}?text=Hola%20ElectroRepara,%20tengo%20un%20caso%20cr%C3%ADtico%20a%20nivel%20de%20placa`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-5 rounded-full border border-cyan-400/40 bg-white/5 backdrop-blur-xl shadow-[0_0_25px_rgba(0,226,255,0.15)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,226,255,0.35)] transition-all duration-300 text-center"
          >
            <span className="text-gray-300">
              ¿Casos críticos o dudas a nivel de placa?{" "}
            </span>
            <span className="text-white font-semibold">
              Habla directamente con nuestro Técnico Experto.
            </span>
          </motion.a>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 border-t border-white/5 pt-6">
          <p className="text-[10px] font-mono tracking-widest uppercase">
            Soberanía tecnológica para el Archipiélago
          </p>
          <p className="text-[10px] font-mono tracking-widest uppercase">
            © {currentYear} ElectroRepara Chiloé • Desarrollado con Precisión
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;