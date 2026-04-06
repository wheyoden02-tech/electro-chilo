import { motion } from "framer-motion";
import { Smartphone, Gamepad2, Monitor, HardDrive } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Apple Total",
    description: "Reparación de iPhone, pantallas y baterías sin errores de \"pieza no original\". Diagnóstico avanzado a nivel de placa.",
    tags: ["iPhone", "iPad", "MacBook"],
    accentVar: "primary",
  },
  {
    icon: Gamepad2,
    title: "Expertos Nintendo",
    description: "Solución definitiva de Joy-Con Drift, mantención completa y servicios de software avanzado. La magia existe.",
    tags: ["Switch", "Joy-Con", "3DS"],
    accentVar: "accent",
  },
  {
    icon: Monitor,
    title: "Universo Consolas",
    description: "Xbox, PlayStation y consolas Retro. Reballing, HDMI, lectores ópticos y más. Todas las generaciones.",
    tags: ["PS5", "Xbox", "Retro"],
    accentVar: "primary",
  },
  {
    icon: HardDrive,
    title: "Cómputo e Integración",
    description: "Notebooks, armado de PC gamer, rescate de datos y upgrade de componentes. Multimarca.",
    tags: ["Notebooks", "PC", "Datos"],
    accentVar: "accent",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ServicesGrid = () => {
  return (
    <section id="servicios" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Servicios</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Soluciones para <span className="text-gradient-neon">cada dispositivo</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="group glass rounded-xl p-6 hover:border-primary/40 transition-all duration-300 pilote-border overflow-visible"
            >
              {/* Icon with technical precision style */}
              <div className={`inline-flex p-3 rounded-lg mb-4 relative ${
                service.accentVar === "primary" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-accent/10 text-accent"
              }`}>
                <service.icon size={24} strokeWidth={1.5} />
                {/* Circuit trace from icon */}
                <div className={`absolute -right-3 top-1/2 w-3 h-px ${
                  service.accentVar === "primary" ? "bg-primary/30" : "bg-accent/30"
                }`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;
