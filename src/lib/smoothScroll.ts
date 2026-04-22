import Lenis from "lenis"

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (typeof window === "undefined") return
  if (lenis) return

  lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    lerp: 0.1,
  })

  function raf(time: number) {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
}

export function getLenis() {
  return lenis
}