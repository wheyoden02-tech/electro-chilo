import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "../../hooks/useGamification";
import { getRandomStarter, fetchPokemonData, playPokemonCry, playUISound } from "../../lib/pokeapi";
import { Gamepad2, MapPin, Phone } from "lucide-react";

// Working PokeAPI item sprites for trainer avatars
const AVATARS = [
  { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", label: "Pikachu Fan" },
  { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", label: "Charizard Fan" },
  { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png", label: "Blastoise Fan" },
  { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png", label: "Venusaur Fan" },
  { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png", label: "Eevee Fan" },
  { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", label: "Mewtwo Fan" },
];

export const OnboardingFlow = () => {
  const { stats, isAuthenticated, isLoadingAuth, saveFullProfile } = useGamification();
  const [step, setStep] = useState(1);
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [assignedPokemonId, setAssignedPokemonId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    city: "",
    consoles: "",
    phone: "",
    avatarUrl: AVATARS[0].url,
  });

  // FIX: No renderizar mientras Firebase aún está cargando el perfil.
  // Sin este guard, el modal aparecía durante ~500ms en CADA visita porque
  // isProfileComplete era false (DEFAULT_STATS) antes de que Firestore respondiera.
  if (isLoadingAuth) return null;

  // Don't render if not authenticated or if profile is already complete
  if (!isAuthenticated || stats.isProfileComplete) return null;

  const handleNext = () => {
    if (!formData.displayName.trim() || !formData.city.trim() || !formData.consoles.trim()) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Assign random starter
    const starterId = getRandomStarter();
    setAssignedPokemonId(starterId);

    // Move to Pokeball animation
    setStep(2);
    playUISound("pokeball", 0.4);

    // Fetch pokemon data and reveal after animation
    fetchPokemonData(starterId).then((data) => {
      setPokemonData(data);
      setTimeout(() => {
        setStep(3);
        // Play the Pokémon's official cry!
        playPokemonCry(starterId, 0.5);
      }, 3500);
    });
  };

  const handleFinish = () => {
    saveFullProfile({
      ...formData,
      pokemonId: assignedPokemonId,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md px-4">
      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════════
            STEP 1: REGISTRATION FORM
        ═══════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-lg bg-card border border-primary/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.15)] max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold font-mono text-center uppercase mb-1 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
              Ficha de Entrenador
            </h2>
            <p className="text-center text-muted-foreground text-xs mb-6">
              ¡Bienvenido al mundo tecnológico! Completa tu ficha para recibir tu Pokémon compañero gratis.
            </p>

            <div className="space-y-5">
              {/* Avatar selection */}
              <div>
                <label className="text-xs font-mono text-primary mb-2 block font-bold uppercase tracking-wider">
                  Elige tu Avatar de Perfil
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((avatar, i) => (
                    <div
                      key={i}
                      onClick={() => setFormData({ ...formData, avatarUrl: avatar.url })}
                      className={`
                        aspect-square rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all p-1 bg-gray-900
                        ${formData.avatarUrl === avatar.url
                          ? "border-primary ring-2 ring-primary/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                          : "border-border/30 grayscale hover:grayscale-0 hover:border-primary/50"}
                      `}
                      title={avatar.label}
                    >
                      <img src={avatar.url} alt={avatar.label} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-mono text-primary mb-1 block font-bold">
                  Apodo / Nombre *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                  placeholder="Ej: Ash, Neo, Red..."
                />
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-mono text-primary mb-1 block font-bold">
                  Ciudad / Región *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-background border border-border pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    placeholder="Ej: Castro, Chiloé"
                  />
                </div>
              </div>

              {/* Consoles */}
              <div>
                <label className="text-xs font-mono text-primary mb-1 block font-bold">
                  Consolas Favoritas *
                </label>
                <div className="relative">
                  <Gamepad2 size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.consoles}
                    onChange={(e) => setFormData({ ...formData, consoles: e.target.value })}
                    className="w-full bg-background border border-border pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    placeholder="Ej: PS5, Nintendo Switch, Game Boy"
                  />
                </div>
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1 block">
                  Número de Contacto (opcional)
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-border pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    placeholder="+56 9 XXXX XXXX"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-primary to-cyan-400 text-black font-bold py-3 rounded-xl mt-4 hover:brightness-110 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
              >
                Crear Ficha y Recibir Pokémon
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STEP 2: POKEBALL SHAKE ANIMATION
        ═══════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 3, filter: "brightness(3)" }}
            className="flex flex-col items-center justify-center"
          >
            {/* Pokeball shaking */}
            <motion.div
              animate={{
                rotate: [0, -25, 25, -25, 25, -15, 15, 0],
                scale: [1, 1.05, 1.05, 1.05, 1.05, 1.02, 1.02, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Pokeball SVG (pure CSS, no external image needed) */}
              <div className="w-40 h-40 rounded-full border-[6px] border-gray-800 overflow-hidden relative shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-800 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-[4px] border-gray-800 rounded-full z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
              </div>
            </motion.div>

            <motion.p
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-10 font-mono text-lg text-center"
            >
              Recibiendo a tu compañero inicial...
            </motion.p>
            <p className="text-xs text-muted-foreground mt-2">La Pokébola se está abriendo...</p>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STEP 3: POKEMON REVEAL
        ═══════════════════════════════════════════════════════════ */}
        {step === 3 && pokemonData && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-full max-w-md bg-card border border-primary/30 px-6 py-8 rounded-2xl shadow-[0_0_60px_rgba(0,255,255,0.1)] flex flex-col items-center text-center"
          >
            <motion.h2
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-xl font-bold font-mono text-yellow-400 uppercase mb-6"
            >
              ¡Felicidades! Tu compañero es...
            </motion.h2>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <img
                src={pokemonData.sprite}
                alt={pokemonData.name}
                className="w-44 h-44 object-contain pixelated drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              />
            </motion.div>

            <h3 className="text-3xl font-bold uppercase tracking-widest mt-4 mb-2 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
              {pokemonData.name}
            </h3>

            <p className="text-xs text-muted-foreground italic max-w-xs mb-2">
              "{pokemonData.lore}"
            </p>

            {/* Mini Stats Preview */}
            <div className="w-full max-w-[250px] mt-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-8 font-mono text-green-400 font-bold">HP</span>
                <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, pokemonData.stats.hp)}%` }} className="h-full bg-green-500 rounded-full" />
                </div>
                <span className="w-7 text-right font-mono text-green-400">{pokemonData.stats.hp}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-8 font-mono text-red-400 font-bold">ATK</span>
                <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, pokemonData.stats.attack)}%` }} className="h-full bg-red-500 rounded-full" />
                </div>
                <span className="w-7 text-right font-mono text-red-400">{pokemonData.stats.attack}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-8 font-mono text-blue-400 font-bold">DEF</span>
                <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, pokemonData.stats.defense)}%` }} className="h-full bg-blue-500 rounded-full" />
                </div>
                <span className="w-7 text-right font-mono text-blue-400">{pokemonData.stats.defense}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold uppercase tracking-widest py-3 px-10 rounded-full hover:scale-105 transition-transform shadow-lg text-sm"
            >
              ¡Comenzar Aventura!
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};