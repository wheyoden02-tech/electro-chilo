// ══════════════════════════════════════════════════════════════
// Available starters: All Gen 1-3 base-form Pokémon that can evolve
// This gives a much wider and fairer pool than just 5
// ══════════════════════════════════════════════════════════════
const STARTERS = [
  1,   // Bulbasaur
  4,   // Charmander
  7,   // Squirtle
  10,  // Caterpie
  13,  // Weedle
  16,  // Pidgey
  19,  // Rattata
  21,  // Spearow
  23,  // Ekans
  25,  // Pikachu
  27,  // Sandshrew
  29,  // Nidoran♀
  32,  // Nidoran♂
  37,  // Vulpix
  39,  // Jigglypuff
  41,  // Zubat
  43,  // Oddish
  46,  // Paras
  48,  // Venonat
  50,  // Diglett
  52,  // Meowth
  54,  // Psyduck
  56,  // Mankey
  58,  // Growlithe
  60,  // Poliwag
  63,  // Abra
  66,  // Machop
  69,  // Bellsprout
  72,  // Tentacool
  74,  // Geodude
  77,  // Ponyta
  79,  // Slowpoke
  81,  // Magnemite
  84,  // Doduo
  86,  // Seel
  88,  // Grimer
  90,  // Shellder
  92,  // Gastly
  96,  // Drowzee
  98,  // Krabby
  100, // Voltorb
  102, // Exeggcute
  104, // Cubone
  109, // Koffing
  111, // Rhyhorn
  116, // Horsea
  118, // Goldeen
  120, // Staryu
  129, // Magikarp
  133, // Eevee
  138, // Omanyte
  140, // Kabuto
  147, // Dratini
  152, // Chikorita
  155, // Cyndaquil
  158, // Totodile
  252, // Treecko
  255, // Torchic
  258, // Mudkip
];

export const getRandomStarter = (): number => {
  // Use crypto for true randomness if available
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return STARTERS[array[0] % STARTERS.length];
  }
  return STARTERS[Math.floor(Math.random() * STARTERS.length)];
};

// ══════════════════════════════════════════════════════════════
// Pokémon Cry / Sound URLs from PokeAPI
// ══════════════════════════════════════════════════════════════
export const getPokemonCryUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
};

export const playPokemonCry = (id: number, volume = 0.4): void => {
  try {
    const audio = new Audio(getPokemonCryUrl(id));
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.play().catch(() => {
      // Silently fail if autoplay is blocked
    });
  } catch {
    // Audio not supported
  }
};

// Generic UI sound effects using Web Audio API
export const playUISound = (type: "levelup" | "badge" | "xp" | "pokeball" | "click", volume = 0.3): void => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.value = volume;

    switch (type) {
      case "levelup":
        // Ascending triumphant notes
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);       // C5
        oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
        oscillator.frequency.setValueAtTime(1047, ctx.currentTime + 0.3); // C6
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case "badge":
        // Achievement chime
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);       // A5
        oscillator.frequency.setValueAtTime(1109, ctx.currentTime + 0.1); // C#6
        oscillator.frequency.setValueAtTime(1319, ctx.currentTime + 0.2); // E6
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;

      case "xp":
        // Quick blip
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.setValueAtTime(900, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.12);
        break;

      case "pokeball":
        // Pokeball wobble/click
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.setValueAtTime(500, ctx.currentTime + 0.08);
        oscillator.frequency.setValueAtTime(200, ctx.currentTime + 0.16);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.25);
        break;

      case "click":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.06);
        break;
    }
  } catch {
    // Web Audio API not supported
  }
};

// ══════════════════════════════════════════════════════════════
// Fetch full Pokémon data including stats, sprite, and Spanish lore
// ══════════════════════════════════════════════════════════════
export const fetchPokemonData = async (id: number) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();

  const hp = data.stats.find((s: any) => s.stat.name === "hp").base_stat;
  const attack = data.stats.find((s: any) => s.stat.name === "attack").base_stat;
  const defense = data.stats.find((s: any) => s.stat.name === "defense").base_stat;

  // Fetch species for Spanish Lore
  let lore = "Un Pokémon misterioso...";
  try {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const speciesData = await speciesRes.json();
    const esEntry = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === "es");
    if (esEntry) {
      lore = esEntry.flavor_text.replace(/\n|\f/g, " ");
    }
  } catch (err) {
    console.error("No lore found", err);
  }

  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.other.showdown.front_default || data.sprites.front_default,
    staticSprite: data.sprites.front_default,
    stats: { hp, attack, defense },
    lore,
  };
};

// ══════════════════════════════════════════════════════════════
// Evolution chain traversal
// ══════════════════════════════════════════════════════════════
export const checkEvolution = async (currentId: number, currentLevel: number): Promise<number | null> => {
  if (currentLevel < 1) return null;

  try {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentId}`);
    const speciesData = await speciesRes.json();
    const chainUrl = speciesData.evolution_chain.url;

    const chainRes = await fetch(chainUrl);
    const chainData = await chainRes.json();

    let found = false;
    let nextStage: any = null;

    const checkTree = (node: any) => {
      const nodeId = parseInt(node.species.url.split("/").filter(Boolean).pop()!);
      if (nodeId === currentId) {
        found = true;
        if (node.evolves_to.length > 0) {
          nextStage = node.evolves_to[0].species;
        }
      } else {
        node.evolves_to.forEach((child: any) => {
          if (!found) checkTree(child);
        });
      }
    };

    checkTree(chainData.chain);

    if (nextStage) {
      const nextId = parseInt(nextStage.url.split("/").filter(Boolean).pop()!);
      // Only return the next evolution if it actually differs from current
      if (nextId !== currentId) {
        return nextId;
      }
    }
  } catch (err) {
    console.error("Failed to check evolution", err);
  }
  return null;
};
