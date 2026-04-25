import React from "react";

const consoles = ["/1.webp", "/2.webp", "/3.webp", "/4.webp", "/5.webp", "/6.webp"];

const ConsoleTicker: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-background py-10">
      {/* Fondo sutil unificado con Services */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.05)_0%,_transparent_70%)] pointer-events-none" />
      <div className="console-mask w-full relative z-10">
        <div
          className="console-track"
          style={{ animationDuration: "55s" }}
        >
          {[...consoles, ...consoles].map((src, index) => {
            const floatDuration = 6 + (index % 5); // variación matemática
            const floatDelay = (index * 0.7) % 5; // desfase distinto

            return (
              <div
                key={index}
                className="flex items-center justify-center px-6"
              >
                <img
                  src={src}
                  alt="Console logo"
                  draggable={false}
                  style={{
                    animation: `tickerFloat ${floatDuration}s ease-in-out infinite`,
                    animationDelay: `${floatDelay}s`,
                  }}
                  className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto transition-all duration-500 ease-out opacity-90 hover:opacity-100 hover:scale-110 drop-shadow-[0_0_18px_hsl(var(--primary)/0.45)]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConsoleTicker;