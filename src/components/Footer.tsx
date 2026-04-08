"use client";

import { motion } from "framer-motion";
import { 
  Smartphone, 
  Gamepad2, 
  Laptop, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Zap, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_BASE = "https://wa.me/56929810915";

const contactOptions = [
  {
    title: "Micro-cirugía iPhone",
    desc: "Placa base y trasplante de IC",
    icon: Smartphone,
    color: "text-blue-400",
    msg: "Hola, necesito una cotización para una reparación de placa/micro-soldadura en mi equipo Apple."
  },
  {
    title: "Sistemas Nintendo",
    desc: "Magia, mantención y Joy-Con",
    icon: Gamepad2,
    color: "text-red-400",
    msg: "Hola, me interesa el servicio de sistema dual y catálogo para mi Nintendo Switch."
  },
  {
    title: "Upgrade & Rescate PC",
    desc: "Recuperación de datos y potencia",
    icon: Laptop,
    color: "text-emerald-400",
    msg: "Hola, mi computador está lento o necesito recuperar archivos de un disco dañado."
  }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-white/5 pt-20 pb-8 overflow-hidden">
      {/* Scanline Effect: Una línea de luz que recorre el borde superior */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scanline" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Main CTA: El gancho Anti-Santiago */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">
              TU TECNOLOGÍA NO NECESITA <br />
              <span className="text-gradient-neon italic">VIAJAR A SANTIAGO</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Evita riesgos de envío y esperas de semanas. En el corazón de <span className="text-foreground font-bold">Castro</span>, realizamos la micro-cirugía electrónica que otros solo ofrecen en la capital.
            </p>
          </motion.div>
        </div>

        {/* 3 Buttons Grid: Pre-Diagnóstico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mb-20">
          {contactOptions.map((opt, i) => (
            <motion.a
              key={opt.title}
              href={`${WHATSAPP_BASE}?text=${encodeURIComponent(opt.msg)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="group relative p-6 rounded-2xl bg-card/30 border border-white/5 backdrop-blur-md flex flex-col justify-between transition-all"
            >
              <div>
                <opt.icon className={cn("mb-4 h-8 w-8", opt.color)} />
                <h3 className="text-lg font-bold mb-1">{opt.title}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{opt.desc}</p>
              </div>
              <div className="mt-8 flex items-center text-sm font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                INICIAR CONSULTA <ChevronRight size={14} className="ml-1" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Lab Specs Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Clock size={16} />
              <span className="text-xs font-mono font-bold uppercase">Disponibilidad</span>
            </div>
            <p className="text-sm">Lun - Vie: 10:00 – 19:00</p>
            <p className="text-xs text-muted-foreground italic">Sábados: 10:00 – 14:00</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <MapPin size={16} />
              <span className="text-xs font-mono font-bold uppercase">Laboratorio</span>
            </div>
            <p className="text-sm font-bold text-foreground">Castro, Chiloé</p>
            <p className="text-xs text-muted-foreground uppercase">Región de Los Lagos</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={16} />
              <span className="text-xs font-mono font-bold uppercase">Estado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold uppercase tracking-tighter text-emerald-500/80">Recibiendo Equipos</p>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start md:items-end">
            <div className="flex items-center gap-2 mb-2">
               <Zap className="text-primary h-5 w-5" />
               <span className="font-black text-xl tracking-tighter">
                ELECTRO<span className="text-primary">REPARA</span>
               </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Castro Division • Tech Lab</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
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