
const SERVICES = [
  {
    title: "Nintendo Switch",
    description:
      "Magia Nintendo profesional. Liberación de consola, instalación de juegos, mantención preventiva y optimización completa para un rendimiento sin límites.",
    img: "/servicios/Nintendo.png",
  },
  {
    title: "Reparación Profesional iPhone",
    description:
      "Reparamos tu iPhone manteniendo su integridad original. Pantallas y baterías sin activar el mensaje de 'pieza desconocida'.",
    img: "/servicios/Iphone.png",
  },
  {
    title: "PS5 & Xbox Series",
    description:
      "Diagnóstico avanzado, limpieza interna, cambio de pasta térmica y reparación de fallas críticas. Rendimiento estable y sin sobrecalentamiento.",
    img: "/servicios/Consolas.png",
  },
  {
    title: "Drift de Mandos",
    description:
      "Reparación precisa de drift en Joy‑Con, DualSense y controles Xbox. Recupera la precisión original de tu mando.",
    img: "/servicios/Joystick.png",
  },
  {
    title: "Diagnóstico & Baterías",
    description:
      "Testeo electrónico avanzado, reemplazo certificado de baterías y diagnóstico integral para equipos con fallas intermitentes o críticas.",
    img: "/servicios/Baterias.png",
  },
];

const ServicesGrid = () => {
  return (
    <section
      id="servicios"
      className="relative w-full min-h-[90vh] py-24 overflow-hidden bg-background"
    >
      {/* Glow dinámico */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mb-20 text-center space-y-4">
        <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">
          Servicios Especializados
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
          Reparación & Tecnología Premium
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 py-8">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="
                rounded-3xl overflow-hidden
                bg-card/60 backdrop-blur-2xl
                border border-border/60
                transition-all duration-500
                hover:-translate-y-1
                hover:border-primary
                hover:shadow-[0_0_40px_hsl(var(--primary)/0.35)]
              "
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-52 sm:h-60 md:h-64 object-cover"
              />

              <div className="p-6 md:p-8 flex flex-col">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-base mt-4 leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex justify-center mt-20">
        <a
          href="https://wa.me/56929810915"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="
              px-10 py-4 rounded-full
              bg-primary text-primary-foreground
              font-semibold tracking-wide
              transition-all duration-300
              hover:scale-105
              hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]
            "
          >
            Consultar otro equipo
          </button>
        </a>
      </div>
    </section>
  );
};

export default ServicesGrid;