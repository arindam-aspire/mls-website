"use client";

import { useEffect, useState } from "react";

export function useMatchMedia(query: string) {
  // Always false on server and first client paint to match SSR markup.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [query]);

  return matches;
}
