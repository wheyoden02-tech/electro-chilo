import { motion } from "framer-motion";
import { Clock, MapPin, ShieldCheck, Star } from "lucide-react";

const pillars = [
  {
    icon: Clock,
    title: "Rapidez",
    description: "Diagnóstico en 24 horas. Mayoría de reparaciones listas en 48-72 hrs.",
  },
  {
    icon: MapPin,
    title: "Local en Castro",
    description: "Atención presencial en el corazón de Chiloé. Sin envíos arriesgados.",
  },
  {
    icon: ShieldCheck,
    title: "Transparencia",
    description: "Cotización antes de reparar. Sin sorpresas. Garantía en cada trabajo.",
  },
];

const testimonials = [
  {
    name: "María José P.",
    text: "Me salvaron el iPhone que daban por muerto en Santiago. Increíble el nivel técnico que tienen acá en Castro.",
  },
  {
    name: "Carlos A.",
    text: "El drift de los Joy-Con de mis hijos, solucionado en un día. 100% recomendado.",
  },
  {
    name: "Francisca R.",
    text: "Rescataron todos mis datos de un disco duro que no prendía. Eternamente agradecida.",
  },
];

const TrustSection = () => {
  return (
    <section id="nosotros" className="py-24 relative carbonized-wood data-mist">
      <div className="container mx-auto px-4 relative z-10">
        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-accent tracking-widest uppercase">¿Por qué elegirnos?</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Confianza que se <span className="text-gradient-neon">demuestra</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                <pillar.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Success Cases Placeholder */}
        <div id="casos-de-éxito" className="mb-20">
          <h3 className="text-xl font-bold text-center mb-8 text-foreground">Casos de Éxito</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: n * 0.1 }}
                className="aspect-square rounded-xl bg-card/60 border border-border/50 flex items-center justify-center overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-muted mb-2 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-mono">#{n}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Caso de éxito</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-xl font-bold text-center mb-8 text-foreground">Lo que dicen nuestros clientes</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-platinum leading-relaxed mb-4">"{t.text}"</p>
                {/* Shingle divider */}
                <div className="shingle-divider mb-3" />
                <p className="text-xs font-semibold text-foreground">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
