import { useEffect, useState } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const useKonamiCode = (onSuccess: () => void) => {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence((prev) => {
        const newSequence = [...prev, e.key];
        // Keep only the last N keys
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }

        // Check if the sequence matches
        if (newSequence.join(",") === KONAMI_CODE.join(",")) {
          onSuccess();
          return []; // Reset after success
        }

        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSuccess]);
};
