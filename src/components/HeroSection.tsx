import { useEffect, useRef } from "react";
import { MeshGradient } from "@/lib/mesh-gradient";

const WHATSAPP_URL =
  "https://wa.me/56929810915?text=Hola%20ElectroRepara%2C%20quiero%20agendar%20una%20reparación";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const gradient = new MeshGradient(canvasRef.current);
    return () => gradient.destroy();
  }, []);

  return (
    <section className="relative min-h-screen w-full h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Canvas Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Glass Content */}
      <div className="relative z-10 w-full px-4 flex justify-center">
        <div
          className="
            max-w-xl w-full text-center
            bg-[rgba(255,255,255,0.03)]
            backdrop-blur-xl
            border border-[rgba(255,255,255,0.1)]
            rounded-3xl
            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
            p-8 md:p-12
          "
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Resucitamos tus consolas y equipos.
          </h1>

          <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
            Servicio técnico especializado en microelectrónica.
            <br />
            Diagnóstico preciso, reparación garantizada.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-block w-full
              py-4 rounded-xl
              bg-white text-black font-bold text-lg
              transition-transform duration-300
              hover:scale-105 hover:brightness-110
            "
          >
            Agendar por WhatsApp
          </a>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
