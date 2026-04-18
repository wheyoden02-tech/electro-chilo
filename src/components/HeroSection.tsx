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
uniform float uFreq;
varying float vElevation;

void main(){
  vec3 pos = position;

  // n1: onda primaria — uFreq la escala para que en mobile se vean 3+ crestas
  float n1 = snoise(vec3(pos.x*0.18*uFreq + uTime*0.18,
                         pos.y*0.18*uFreq,
                         uTime*0.12));

  // n2/n3: detalle orgánico — frecuencias fijas (no escaladas por uFreq)
  // para que no se vuelvan jagged al subir uFreq en mobile
  float n2 = snoise(vec3(pos.x*0.38 - uTime*0.09,
                         pos.y*0.42 + uTime*0.07,
                         uTime*0.14)) * 0.50;

  float n3 = snoise(vec3(pos.x*0.72 + uTime*0.05,
                         pos.y*0.68,
                         uTime*0.10)) * 0.12;

  float raw = (n1 + n2 + n3) * uAmplitude;

  // Saturación suave (k=0.20): redondea crestas sin aplastar el rango dinámico
  float elevation = raw / (1.0 + 0.20 * abs(raw));
  pos.z = elevation;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}`;

// ─── Fragment Shader — Paleta "Plasma Premium" 5 paradas ────────────────────
// Valles → Púrpura → Cian → Esmeralda → Oro — cada banda de ola muestra un tono distinto
const fragmentShader = `
uniform float uAmplitude;
uniform float uContrast;
varying float vElevation;

const vec3 C_ABYSS   = vec3(0.059, 0.090, 0.165);   // #0F172A — slate profundo
const vec3 C_PURPLE  = vec3(0.420, 0.129, 0.659);   // #6B21A8 — purple-700
const vec3 C_CYAN    = vec3(0.000, 0.886, 1.000);   // #00E2FF — cian eléctrico
const vec3 C_EMERALD = vec3(0.102, 0.827, 0.627);   // #1AD3A0 — esmeralda
const vec3 C_GOLD    = vec3(1.000, 0.843, 0.000);   // #FFD700 — Pikachu gold

void main(){
  float maxE = uAmplitude * 1.10;
  float t = clamp((vElevation + maxE) / (2.0 * maxE), 0.0, 1.0);

  float ts = smoothstep(0.5 - uContrast, 0.5 + uContrast, t);

  // 5 paradas distribuidas: cada banda de ola tiene su color propio
  vec3 color;
  if(ts < 0.25)
    color = mix(C_ABYSS, C_PURPLE, ts / 0.25);
  else if(ts < 0.50)
    color = mix(C_PURPLE, C_CYAN, (ts - 0.25) / 0.25);
  else if(ts < 0.75)
    color = mix(C_CYAN, C_EMERALD, (ts - 0.50) / 0.25);
  else
    color = mix(C_EMERALD, C_GOLD, (ts - 0.75) / 0.25);

  // Shading: valles oscuros → crestas brillantes
  float light = 0.18 + 0.82 * ts;
  color *= light;

  // Halo dorado sutil en las crestas más altas
  float spec = pow(max(ts - 0.80, 0.0) / 0.20, 2.0) * 1.2;
  color += vec3(spec * 0.9, spec * 0.65, spec * 0.0);

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
    // 256 desktop / 128 tablet / 96 mobile
    const segs = isMobile ? 96 : w < 1280 ? 128 : 256;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    // En mobile Android limitamos DPR a 1 para mantener framerate estable
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1) : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.setClearColor(0x0f172a);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    // Mobile portrait: cámara más cerca y más baja → las olas se ven más "de frente"
    camera.position.set(0, isMobile ? 0.5 : 1.5, isMobile ? 6.5 : 9);

    const geometry = new THREE.PlaneGeometry(15, 15, segs, segs);
    const uniforms = {
      uTime:      { value: 0.0 },
      // Mobile: amplitud alta para que la elevación genere contraste de color real
      uAmplitude: { value: isMobile ? 1.8 : 1.1 },
      // Mobile: freq 2.8× → ~3 crestas visibles en pantalla portrait
      // (solo afecta n1; n2/n3 usan freq fija para no perder suavidad)
      uFreq:      { value: isMobile ? 2.8 : 1.0 },
      // Mobile: bandas definidas pero no cortantes (0.28)
      uContrast:  { value: isMobile ? 0.28 : 0.50 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    // Mobile: menos inclinación → se ven más olas en lugar de proyectarlas planas
    mesh.rotation.x = isMobile ? -Math.PI / 5 : -Math.PI / 4;
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
    // Mobile: ritmo lento y fluido — como agua, no como máquina
    const speedMult = isMobile ? 0.85 : 1.0;
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime() * speedMult;
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

const HeroSection = () => (
  <section
    className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    style={{ background: "#0F172A" }}
  >
    {/* Canvas 3D */}
    <WaveCanvas />

    {/* Card — único layer, todo el contenido aquí */}
    <div className="relative z-10 w-full flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl text-center flex flex-col items-center rounded-2xl px-6 py-8 md:px-12 md:py-12"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 8px 60px rgba(0,226,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
          className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full mb-5 md:mb-8"
          style={{
            background: "rgba(0,226,255,0.10)",
            border: "1px solid rgba(0,226,255,0.30)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00E2FF] animate-glow-pulse" />
          <span className="text-[10px] md:text-xs font-mono tracking-widest text-[#00E2FF]">
            SERVICIO TÉCNICO — CHILOÉ
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white mb-5 md:mb-8"
        >
          Resucitamos tus consolas y tecnología
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-sm md:text-base lg:text-lg leading-relaxed max-w-md mb-8 md:mb-10"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          Reparación profesional de{" "}
          <strong className="text-white/95">iPhone</strong>,{" "}
          <strong className="text-white/95">Nintendo Switch</strong>,{" "}
          <strong className="text-white/95">consolas</strong> y{" "}
          <strong className="text-white/95">computadores</strong> en Castro, Chiloé.
        </motion.p>

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto mb-8 md:mb-10"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-heartbeat inline-flex items-center justify-center gap-2 px-7 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base text-white transition-shadow duration-300"
            style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.animationPlayState = "paused";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 48px rgba(37,211,102,0.65), 0 6px 28px rgba(37,211,102,0.45)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.animationPlayState = "running";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
              (e.currentTarget as HTMLAnchorElement).style.transform = "";
            }}
          >
            <MessageCircle size={18} />
            Agendar por WhatsApp
          </a>

          <a
            href="#servicios"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base text-white transition-all duration-200"
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
            <ArrowRight size={15} />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="flex justify-center gap-8 md:gap-10 pt-5 md:pt-6 w-full"
          style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl md:text-2xl font-bold" style={{ color: "#00E2FF" }}>
                {stat.value}
              </div>
              <div className="text-[10px] md:text-xs mt-1 tracking-wide font-mono" style={{ color: "rgba(255,255,255,0.45)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
