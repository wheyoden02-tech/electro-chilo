import { useEffect, useRef, useState } from "react";

const SERVICES = [
  {
    title: "Apple Total",
    description:
      "Micro-cirugía electrónica de alta precisión. Reemplazos sin mensajes de pieza desconocida ni advertencias del sistema.",
    img: "/servicios/apple.webp",
  },
  {
    title: "Nintendo Magia",
    description:
      "Acceso a miles de títulos con sistema dual. Configuración optimizada en entorno 100% independiente y seguro.",
    img: "/servicios/nintendo.webp",
  },
  {
    title: "Universo Consolas",
    description:
      "Revivimos y potenciamos tu consola favorita. Soporte completo para PlayStation y Xbox de todas las generaciones.",
    img: "/servicios/consolas.webp",
  },
  {
    title: "Cómputo Pro",
    description:
      "Soluciones para notebooks y computadores. Upgrades de hardware y rescate crítico de datos para todo tipo de equipos.",
    img: "/servicios/notebook.webp",
  },
];

const ServicesGrid = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(0);
  const lastX = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Movimiento automático infinito
  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        position.current -= 0.4;
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

  // Drag desktop
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

  // Touch móvil
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
      className="relative w-full min-h-[85vh] py-20 overflow-hidden bg-[#0B0F19]"
    >
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,226,255,0.05)_0%,_transparent_70%)] pointer-events-none" />

      {/* Título */}
      <div className="relative z-10 mb-16 text-center space-y-4">
        <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">
          Servicios
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient-neon">
          Reparación & Tecnología
        </h2>
      </div>

      {/* Carrusel */}
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
          className="flex gap-8 py-6 pointer-events-auto"
          style={{ transform: "translateX(0px)" }}
        >
          {[...SERVICES, ...SERVICES].map((service, index) => (
            <div
              key={index}
              className="
                min-w-[260px] md:min-w-[320px]
                rounded-2xl overflow-hidden
                bg-slate-900/40 backdrop-blur-xl
                border border-white/10
                transition-all duration-300
                hover:border-[#FACC15]
                hover:shadow-[0_0_30px_rgba(250,204,21,0.25)]
                cursor-grab active:cursor-grabbing
              "
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-48 md:h-56 object-cover"
              />

              <div className="p-6 flex flex-col">
                <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {service.title}
                </h3>

                <p className="text-sm mt-3 leading-relaxed text-gray-200">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Premium */}
      <div className="relative z-10 flex justify-center mt-16">
        <a
          href="https://wa.me/56929810915"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <button
            className="
              px-8 py-4 rounded-full
              border border-[#00E2FF]
              text-[#00E2FF] font-semibold tracking-wide
              transition-all duration-300
              hover:bg-[#00E2FF] hover:text-black
              animate-glow-pulse
            "
          >
            CONSULTAR POR OTROS EQUIPOS
          </button>
        </a>
      </div>
    </section>
  );
};

export default ServicesGrid;