import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import * as THREE from "three";

const WHATSAPP_URL =
  "https://wa.me/56929810915?text=Hola%20ElectroRepara%2C%20necesito%20una%20cotización";

// ─── Simplex Noise 3D — Stefan Gustavson / Ian McEwan ────────────────────────
const SNOISE_GLSL = `
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.7928429-0.8537347*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(
      i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

// ─── Vertex Shader — FBM suave, frecuencias bajas = aspecto líquido ──────────
const vertexShader = `
${SNOISE_GLSL}
uniform float uTime;
uniform float uAmplitude;
varying float vElevation;

void main(){
  vec3 pos = position;

  // Frecuencias reducidas → ondas anchas y curvas (plasma, no picos)
  float n1 = snoise(vec3(pos.x*0.18 + uTime*0.18,
                         pos.y*0.18,
                         uTime*0.12));

  float n2 = snoise(vec3(pos.x*0.38 - uTime*0.09,
                         pos.y*0.42 + uTime*0.07,
                         uTime*0.14)) * 0.55;

  float n3 = snoise(vec3(pos.x*0.72 + uTime*0.05,
                         pos.y*0.68,
                         uTime*0.10)) * 0.25;

  // Smoothstep para suavizar crestas y valles
  float raw = (n1 + n2 + n3) * uAmplitude;
  float elevation = raw;
  pos.z = elevation;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}`;

// ─── Fragment Shader — Paleta "Pikachu / Plasma Premium" ─────────────────────
// Valles: #0F172A (Slate oscuro)  →  Medio: #00E2FF (Cian eléctrico)  →  Crestas: #FFD700 (Amarillo Pikachu)
const fragmentShader = `
uniform float uAmplitude;
varying float vElevation;

const vec3 C_DEEP  = vec3(0.059, 0.090, 0.165);   // #0F172A — slate abyss
const vec3 C_CYAN  = vec3(0.000, 0.886, 1.000);   // #00E2FF — electric cyan
const vec3 C_GOLD  = vec3(1.000, 0.843, 0.000);   // #FFD700 — Pikachu gold

void main(){
  float maxE = uAmplitude * 1.80;
  float t = clamp((vElevation + maxE) / (2.0 * maxE), 0.0, 1.0);

  // Curva suave para evitar transiciones bruscas
  float ts = smoothstep(0.0, 1.0, t);

  vec3 color;
  if(ts < 0.45)
    color = mix(C_DEEP, C_CYAN, ts / 0.45);
  else
    color = mix(C_CYAN, C_GOLD, (ts - 0.45) / 0.55);

  // Shading: valles oscuros (20%) → crestas brillantes (100%)
  float light = 0.20 + 0.80 * ts;
  color *= light;

  // Halo dorado solo en las crestas más altas
  float spec = pow(max(ts - 0.78, 0.0) / 0.22, 2.0) * 1.6;
  color += vec3(spec * 1.0, spec * 0.75, spec * 0.0);

  gl_FragColor = vec4(color, 1.0);
}`;

// ─── WaveCanvas — Three.js directo (compatible con React 18.3) ───────────────
function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const isMobile = w < 768;
    // 256 desktop / 128 tablet / 80 mobile — respeta la petición del cliente
    const segs = isMobile ? 80 : w < 1280 ? 128 : 256;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.setClearColor(0x0f172a);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, 1.5, 9);

    const geometry = new THREE.PlaneGeometry(15, 15, segs, segs);
    const uniforms = {
      uTime:      { value: 0.0 },
      uAmplitude: { value: 1.1 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 4;
    scene.add(mesh);

    const onResize = () => {
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#0F172A" }}
    />
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "500+", label: "Reparaciones" },
  { value: "98%",  label: "Satisfacción"  },
  { value: "24h",  label: "Respuesta"     },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => (
  <section
    className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    style={{ background: "#0F172A" }}
  >
    {/* Layer 0 — 3D WebGL terrain */}
    <WaveCanvas />

    {/* Layer 1 — Glass card (z:20) — contains everything EXCEPT the H1 */}
    <div className="container mx-auto px-4 absolute inset-0 z-20 flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full text-center rounded-3xl p-8 md:p-12"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 60px rgba(0,226,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.55, ease: "backOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: "rgba(0,226,255,0.10)",
            border: "1px solid rgba(0,226,255,0.30)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00E2FF] animate-glow-pulse" />
          <span className="text-xs font-mono tracking-widest text-[#00E2FF]">
            SERVICIO TÉCNICO CERTIFICADO — CHILOÉ
          </span>
        </motion.div>

        {/* H1 invisible placeholder — reserves vertical space in the card */}
        <div
          className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5"
          style={{ visibility: "hidden", userSelect: "none" }}
          aria-hidden="true"
        >
          Resucitamos tus consolas y tecnología
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto"
          style={{ color: "rgba(255,255,255,0.70)" }}
        >
          Reparación profesional de{" "}
          <strong className="text-white/95">iPhone</strong>,{" "}
          <strong className="text-white/95">Nintendo Switch</strong>,{" "}
          <strong className="text-white/95">consolas</strong> y{" "}
          <strong className="text-white/95">computadores</strong> en Castro, Chiloé.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          {/* WhatsApp — soft heartbeat */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-heartbeat inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base md:text-lg text-white transition-shadow duration-300"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.animationPlayState = "paused";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 48px rgba(37,211,102,0.65), 0 6px 28px rgba(37,211,102,0.45)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.animationPlayState = "running";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
              (e.currentTarget as HTMLAnchorElement).style.transform = "";
            }}
          >
            <MessageCircle size={22} />
            Agendar por WhatsApp
          </a>

          <a
            href="#servicios"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm md:text-base text-white transition-all duration-200"
            style={{ border: "1px solid rgba(255,255,255,0.18)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,226,255,0.5)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#00E2FF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
              (e.currentTarget as HTMLAnchorElement).style.color = "white";
            }}
          >
            Ver Servicios
            <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex justify-center gap-8 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#00E2FF" }}>
                {stat.value}
              </div>
              <div
                className="text-xs mt-1 tracking-wide font-mono"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>

    {/* Layer 2 — H1 blend overlay (z:30) — mirrors card structure so alignment is pixel-perfect */}
    {/* No backdrop-filter ancestor → mix-blend-mode composites against the canvas directly */}
    <div className="container mx-auto px-4 absolute inset-0 z-30 flex items-center justify-center pointer-events-none py-20">
      <div className="max-w-2xl w-full text-center rounded-3xl p-8 md:p-12">
        {/* Badge mirror — invisible spacer with identical markup so height matches exactly */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ visibility: "hidden" }}
          aria-hidden="true"
        >
          <span className="w-2 h-2 rounded-full" />
          <span className="text-xs font-mono tracking-widest">SERVICIO TÉCNICO CERTIFICADO — CHILOÉ</span>
        </div>
        {/* H1 — VISIBLE, blends against canvas waves */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5"
          style={{ color: "#ffffff", mixBlendMode: "difference" }}
        >
          Resucitamos tus consolas y tecnología
        </motion.h1>
      </div>
    </div>
  </section>
);

export default HeroSection;
