import React from "react";

const consoles = ["/1.webp", "/2.webp", "/3.webp", "/4.webp", "/5.webp", "/6.webp"];

const ConsoleTicker: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B0F19]">
      <div className="console-mask w-full">
        <div className="console-track">
          {[...consoles, ...consoles].map((src, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              <img
                src={src}
                alt="Console logo"
                className="h-20 sm:h-16 md:h-20 lg:h-24 w-auto transition-all duration-500 ease-out drop-shadow-[0_0_8px_#00E2FF] hover:drop-shadow-[0_0_16px_#00E2FF]"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsoleTicker;