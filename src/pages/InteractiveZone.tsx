import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const legacyApps = [
  { id: "doom", label: "DOOM", core: "gba", rom: "doom.gba", img: "/games/doom.jpg" },
  { id: "dkc", label: "Donkey Kong Country", core: "gba", rom: "dkc.gba", img: "/games/donkeykong.jpg" },
  { id: "smas", label: "Super Mario All-Stars", core: "snes", rom: "smas.sfc", img: "/games/supermario.jpg" },
  { id: "mk2", label: "Mortal Kombat II", core: "snes", rom: "mk2.sfc", img: "/games/mk2.jpg" },
  { id: "ssf2", label: "Super Street Fighter II", core: "snes", rom: "ssf2.smc", img: "/games/st2.jpg" },
];

const InteractiveZone = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const matrixRef = useRef(null);
  const frameRef = useRef(null);
  const displayRef = useRef(null);

  // Barra fullscreen en móvil
  const [mobileFullscreenBar, setMobileFullscreenBar] = useState(false);

  // Fullscreen detection (option C: both fullscreenElement + fullscreenchange event)
  const updateFullscreenState = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState);
    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener("webkitfullscreenchange", updateFullscreenState);
    };
  }, [updateFullscreenState]);

  const enterFullscreen = useCallback(() => {
    const el = displayRef.current || document.getElementById("main-display-area");
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }, []);

  // Detectar móvil + recordar aceptación pantalla completa
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|iphone|ipad|ipod/.test(ua);
    const isSmallScreen = window.innerWidth < 768;
    const shouldShowHint = isMobileUA && isSmallScreen;
    const alreadyAccepted = localStorage.getItem("retrozone_fullscreen_accepted") === "1";

    if (shouldShowHint && !alreadyAccepted) {
      setMobileFullscreenBar(true);
    }
  }, []);

  // Matrix rain animation
  useEffect(() => {
    if (selectedApp) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const canvas = matrixRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / 14);
    const drops = Array.from({ length: cols }, () => Math.random() * -150);
    const speeds = Array.from({ length: cols }, () => 0.4 + Math.random() * 1.4);
    const sizes = Array.from({ length: cols }, () => 10 + Math.floor(Math.random() * 7));
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}!@#$%&*";
    const colors = ["#00d4ff", "#00ff80", "#00ffcc", "#ffffff", "#00d4ff", "#00ff80"];

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.045)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = sizes[i];

        ctx.font = `bold ${size}px 'Courier New', monospace`;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = Math.random() > 0.85 ? 12 : 4;
        ctx.globalAlpha = 0.5 + Math.random() * 0.5;
        ctx.fillText(char, i * 14, y * size * 0.6);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        if (y * size * 0.6 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += speeds[i];
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [selectedApp]);

  // Loading state on game select
  useEffect(() => {
    if (selectedApp) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedApp]);

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-gray-100 px-6 py-12 md:px-12 selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] tracking-tighter">
            RETRO <span className="text-green-400">ZONE</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Recuerdos de cortesía para la comunidad de Chiloé.
            <span className="block text-sm mt-1 opacity-60 italic">
              Tecnología de punta, alma de archipiélago.
            </span>
          </p>
        </header>

        {/* Grid de juegos */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {legacyApps.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`
                relative rounded-xl border-2 overflow-hidden transition-all duration-300 group text-left
                ${
                  selectedApp?.id === app.id
                    ? "border-green-400 shadow-[0_0_24px_rgba(74,222,128,0.35)]"
                    : "border-gray-700 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(34,211,238,0.25)]"
                }
              `}
            >
              <div className="bg-gray-900 w-full">
                <div className="relative">
                  <img
                    src={
                      app.img ||
                      `https://placehold.co/300x180/0d1117/00d4ff?text=${encodeURIComponent(app.label)}`
                    }
                    alt={app.label}
                    className="w-full object-cover h-32"
                  />
                  <span className="absolute top-2 right-2 bg-black/80 text-cyan-400 font-mono text-[10px] px-2 py-0.5 rounded border border-cyan-500/50">
                    {app.core.toUpperCase()}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm text-center leading-tight">
                    {app.label}
                  </p>
                  {selectedApp?.id === app.id && (
                    <p className="text-green-400 font-mono text-xs text-center mt-1">
                      ▶ JUGANDO
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </section>

        {/* Pantalla del emulador */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-green-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative rounded-2xl p-4 md:p-6 border border-cyan-500/50 bg-black/80 backdrop-blur-xl shadow-2xl">
            {selectedApp ? (
              <p className="font-mono text-green-400 text-sm mb-3 flex items-center gap-2">
                <span className="animate-pulse">▶</span> {selectedApp.label}
              </p>
            ) : (
              <p className="font-mono text-cyan-700 text-sm mb-3">
                SELECCIONA UN JUEGO ARRIBA ↑
              </p>
            )}

            {mobileFullscreenBar && (
              <div className="mb-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/30 to-green-500/30 border border-cyan-400/40 text-center shadow-[0_0_12px_rgba(34,211,238,0.45)] flex items-center justify-between gap-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs">
                  <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                  Mejor en pantalla completa
                </div>

                <button
                  onClick={() => {
                    enterFullscreen();
                    localStorage.setItem("retrozone_fullscreen_accepted", "1");
                    setMobileFullscreenBar(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 text-xs font-bold text-black shadow-[0_0_8px_rgba(34,211,238,0.9)] active:scale-95 transition-transform"
                >
                  Entrar en pantalla completa
                </button>
              </div>
            )}

            <div
              id="main-display-area"
              ref={displayRef}
              className="aspect-video w-full bg-black rounded-xl border border-cyan-900/50 flex flex-col overflow-hidden relative"
            >
              {/* Fullscreen button — only visible when NOT in fullscreen */}
              {!isFullscreen && (
                <div className="flex justify-end p-2 shrink-0">
                  <button
                    onClick={enterFullscreen}
                    className="px-2.5 py-1 text-[11px] font-mono text-gray-400 hover:text-cyan-400 bg-black/60 hover:bg-black/80 border border-gray-700 hover:border-cyan-500/50 rounded-md transition-all duration-200"
                    title="Pantalla completa"
                  >
                    Pantalla completa
                  </button>
                </div>
              )}

              {/* Emulator content area */}
              <div className="flex-1 flex items-center justify-center relative min-h-0">
                <AnimatePresence mode="wait">
                  {selectedApp ? (
                    isLoading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="w-12 h-12 border-4 border-t-green-400 border-cyan-900 rounded-full animate-spin"></div>
                        <p className="text-green-400 font-mono text-sm animate-pulse">
                          CARGANDO CORE: {selectedApp.core.toUpperCase()}...
                        </p>
                      </motion.div>
                    ) : (
                      <motion.iframe
                        key="emulator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={`/emulator/index.html?rom=${selectedApp.rom}&system=${selectedApp.core}`}
                        className="w-full h-full border-none"
                        title="Legacy System Render"
                        allow="gamepad"
                      />
                    )
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      {/* Canvas Matrix */}
                      <canvas
                        ref={matrixRef}
                        className="absolute inset-0 w-full h-full"
                      />

                      {/* Ícono idle encima del matrix */}
                      <motion.div
                        animate={{
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.06, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative z-10 flex flex-col items-center gap-3"
                      >
                        <i className="fa-solid fa-gamepad text-6xl text-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,0.8)]"></i>
                        <p className="font-mono text-cyan-400 text-sm tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                          SELECCIONA UN JUEGO
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Panel informativo */}
        <section className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-5 space-y-4">
          <h3 className="font-mono text-cyan-400 font-bold flex items-center gap-2 text-sm">
            <i className="fa-solid fa-circle-info"></i>
            ¿CÓMO USAR EL EMULADOR?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-400 text-xs font-mono">
            <div className="flex items-start gap-2">
              <span className="text-lg">💾</span>
              <div>
                <p className="text-gray-200 font-bold">GUARDAR PARTIDA</p>
                <p>Usa el botón de guardar en la barra del emulador</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🎮</span>
              <div>
                <p className="text-gray-200 font-bold">CONFIGURAR BOTONES</p>
                <p>Mapea tu teclado o control USB desde la barra</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔊</span>
              <div>
                <p className="text-gray-200 font-bold">VOLUMEN</p>
                <p>Ajusta el audio en la barra inferior del juego</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">⛶</span>
              <div>
                <p className="text-gray-200 font-bold">PANTALLA COMPLETA</p>
                <p>Expande desde el ícono en la barra inferior</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-xs italic">
            Todos los controles aparecen en la barra debajo del juego al
            seleccionarlo
          </p>
        </section>

        {/* CTA retención */}
        <section className="w-full bg-black/60 border border-green-500/40 rounded-xl p-4 text-center space-y-2">
          <p className="font-mono text-gray-400 text-sm">
            ¿Tu consola real no arranca?
          </p>
          <a
            href="https://wa.me/56929810915?text=Hola%20ElectroRepara!%20Vi%20la%20Retro%20Zone%20y%20necesito%20reparar%20mi%20consola"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-green-400 animate-pulse text-sm hover:text-green-300 transition-colors"
          >
            Nosotros la reparamos → Cotiza en 30 segundos
          </a>
        </section>

        {/* Botón WhatsApp + volver */}
        <section className="flex flex-col items-center gap-6 pt-4 pb-8">
          <motion.a
            href="https://wa.me/56929810915?text=Hola%20ElectroRepara!%20Vengo%20de%20la%20Zona%20Retro%20y%20necesito%20reparar%20mi%20equipo"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 10px #00ff8033",
                "0 0 25px #00ff8066",
                "0 0 10px #00ff8033",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="px-10 py-5 bg-green-500 text-black font-black text-lg rounded-2xl flex items-center gap-3 shadow-lg"
          >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
            ¿TU CONSOLA NO ENCIENDE? COTIZA AQUÍ
          </motion.a>

          <Link
            to="/"
            className="text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm uppercase tracking-widest"
          >
            <i className="fa-solid fa-arrow-left"></i> Volver al Taller
          </Link>
        </section>
      </div>
    </main>
  );
};

export default InteractiveZone;