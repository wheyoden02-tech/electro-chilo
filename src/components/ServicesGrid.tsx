import { useEffect, useRef, useState } from "react";

const SERVICES = [
  {
    title: "Apple Total",
    description: `Micro-cirugía electrónica de alta precisión. Reemplazos sin mensajes de "pieza desconocida" ni advertencias de sistema.`,
    img: "/apple.png",
  },
  {
    title: "Nintendo Magia",
    description:
      "Acceso a miles de títulos con sistema dual. Arma tu selección en un entorno 100% independiente y sin riesgos.",
    img: "/nintendo.jpeg",
  },
  {
    title: "Universo Consolas",
    description:
      "Revivimos y potenciamos tu consola favorita. Soporte completo para PlayStation y Xbox de todas las épocas.",
    img: "/xbox.jpeg",
  },
  {
    title: "Cómputo Pro",
    description:
      "Soluciones para Notebooks y Computadoras. Upgrades de hardware y rescate crítico de datos para todo tipo de equipos.",
    img: "/notebook.jpeg",
  },
];

const ServicesGrid = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(0);
  const lastX = useRef(0);
  const animationRef = useRef<number | null>(null);

  // --- Movimiento automático C2 (izquierda → reinicio)
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

  // --- Drag manual
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

  // --- Touch soporte móvil
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
      className="
        relative w-full h-screen overflow-hidden
        shingle-pattern flex flex-col items-center justify-center
      "
    >
      {/* Título */}
      <div className="mb-12 text-center">
        <span className="text-xs font-mono text-primary tracking-widest uppercase">
          Servicios
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 text-gradient-neon drop-shadow-lg">
          Reparación & Tecnología
        </h2>
      </div>

      {/* Carrusel tipo C2 */}
      <div
        className="
          relative w-full max-w-7xl overflow-hidden select-none
          px-4 md:px-8
        "
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
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="
                min-w-[260px] md:min-w-[320px]
                rounded-2xl overflow-hidden 
                bg-card/40 backdrop-blur-xl 
                border border-border/50 
                shadow-[0_0_25px_hsl(var(--neon-cyan)/0.35)]
                transition-transform duration-300
                hover:scale-[1.05]
                cursor-grab active:cursor-grabbing
              "
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-48 md:h-56 object-cover opacity-90"
              />

              <div className="p-5 bg-gradient-to-t from-black/70 to-black/20 h-[160px] flex flex-col">
                <h3
                  className="
                    text-lg md:text-xl font-bold 
                    bg-gradient-to-r from-primary via-accent to-primary 
                    bg-clip-text text-transparent
                    drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]
                  "
                >
                  {service.title}
                </h3>

                <p
                  className="
                    text-sm mt-2 leading-relaxed opacity-90
                    text-transparent bg-clip-text
                    bg-[linear-gradient(to_right,rgba(0,255,255,0.35),rgba(255,0,255,0.35))]
                    mix-blend-screen
                  "
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}

          {/* Duplicado para loop infinito */}
          {SERVICES.map((service, index) => (
            <div
              key={`copy-${index}`}
              className="
                min-w-[260px] md:min-w-[320px]
                rounded-2xl overflow-hidden 
                bg-card/40 backdrop-blur-xl 
                border border-border/50 
                shadow-[0_0_25px_hsl(var(--neon-cyan)/0.35)]
                transition-transform duration-300
                hover:scale-[1.05]
                cursor-grab active:cursor-grabbing
              "
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-48 md:h-56 object-cover opacity-90"
              />

              <div className="p-5 bg-gradient-to-t from-black/70 to-black/20 h-[160px] flex flex-col">
                <h3
                  className="
                    text-lg md:text-xl font-bold 
                    bg-gradient-to-r from-primary via-accent to-primary 
                    bg-clip-text text-transparent
                    drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]
                  "
                >
                  {service.title}
                </h3>

                <p
                  className="
                    text-sm mt-2 leading-relaxed opacity-90
                    text-transparent bg-clip-text
                    bg-[linear-gradient(to_right,rgba(0,255,255,0.35),rgba(255,0,255,0.35))]
                    mix-blend-screen
                  "
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-muted-foreground text-sm">
        ¿No está lo que buscas? No dudes en contáctarnos!
      </p>
    </section>
  );
};

export default ServicesGrid;