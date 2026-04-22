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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Expertos en Consolas <br className="hidden md:block" />
            y Smartphones
          </h1>

          <p className="text-zinc-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
            Reparamos lo que otros dan por perdido. Diagnóstico preciso,
            microsoldadura avanzada y repuestos garantizados para tu equipo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold">
              Diagnosticar mi equipo
            </button>
            <button className="px-8 py-3 border border-white/30 hover:border-white transition rounded-lg font-semibold">
              Cotizar reparación
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}