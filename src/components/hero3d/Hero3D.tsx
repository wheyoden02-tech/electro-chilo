import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Scene from "./Scene"

export default function Hero3D() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black">
      
      {/* Fondo */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-black via-zinc-900 to-black" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.2),transparent_65%)]" />

      {/* Nintendo 3D BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex items-center justify-center px-6 min-h-[100svh]">
        <div className="text-white text-center max-w-4xl space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-snug md:leading-tight">
            Expertos en iPhone, Nintendo <br className="hidden md:block" />
            y Consolas de Última Generación.
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Especialistas en iPhone, consolas Nintendo y equipos de última generación como PS5 y Xbox Series.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/56929810915?text=Hola%20Jorge,%20necesito%20ayuda%20con%20mi%20iPhone%20o%20consola"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#E60012] hover:bg-[#cc0010] transition rounded-lg font-semibold"
            >
              Habla directo con el experto
            </a>
            <a
              href="/magia"
              className="px-8 py-3 border border-white/30 hover:border-white transition rounded-lg font-semibold"
            >
              Elige tu lista de juegos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}