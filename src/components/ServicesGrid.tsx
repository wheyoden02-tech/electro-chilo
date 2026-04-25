import { useEffect, useRef, useState } from "react";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(0);
  const lastX = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        position.current -= 0.35;
      }

      const track = trackRef.current;
      if (track) {
        const totalWidth = track.scrollWidth;
        const visibleWidth = track.offsetWidth;

        if (Math.abs(position.current) >= totalWidth - visibleWidth) {
          position.current = 0;
        }

        track.style.transform = `translateX(${position.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - lastX.current;
    lastX.current = e.clientX;
    position.current += delta;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    lastX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - lastX.current;
    lastX.current = e.touches[0].clientX;
    position.current += delta;
  };

  const handleTouchEnd = () => setIsDragging(false);

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

      <div
        className="relative z-10 w-full max-w-7xl mx-auto overflow-hidden select-none px-4 md:px-8"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex gap-10 py-8"
          style={{ transform: "translateX(0px)" }}
        >
          {[...SERVICES, ...SERVICES].map((service, index) => (
            <div
              key={index}
              className="
                min-w-[280px] sm:min-w-[320px] md:min-w-[380px]
                rounded-3xl overflow-hidden
                bg-card/60 backdrop-blur-2xl
                border border-border/60
                transition-all duration-500
                hover:scale-105
                hover:border-primary
                hover:shadow-[0_0_40px_hsl(var(--primary)/0.35)]
                cursor-grab active:cursor-grabbing
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