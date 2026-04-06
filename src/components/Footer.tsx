import { motion } from "framer-motion";
import { MessageCircle, Zap, Clock, MapPin } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/56912345678?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/30 relative">
      <div className="container mx-auto px-4">
        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Listo para reparar tu dispositivo?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Escríbenos por WhatsApp y recibe tu cotización sin compromiso.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pulse-whatsapp inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-[0_0_40px_hsl(145,100%,45%,0.5)] transition-all"
          >
            <MessageCircle size={24} />
            Escríbenos por WhatsApp
          </a>
        </motion.div>

        {/* Info */}
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center mb-12">
          <div className="flex flex-col items-center gap-2">
            <Clock size={20} className="text-primary" />
            <p className="text-sm text-foreground font-semibold">Horario</p>
            <p className="text-xs text-muted-foreground">Lun - Vie: 10:00 – 19:00</p>
            <p className="text-xs text-muted-foreground">Sáb: 10:00 – 14:00</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MapPin size={20} className="text-accent" />
            <p className="text-sm text-foreground font-semibold">Ubicación</p>
            <p className="text-xs text-muted-foreground">Castro, Chiloé</p>
            <p className="text-xs text-muted-foreground">Región de Los Lagos</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MessageCircle size={20} className="text-primary" />
            <p className="text-sm text-foreground font-semibold">Contacto</p>
            <p className="text-xs text-muted-foreground">WhatsApp: +56 9 1234 5678</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Electro<span className="text-primary">Repara</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ElectroRepara Chiloé. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
