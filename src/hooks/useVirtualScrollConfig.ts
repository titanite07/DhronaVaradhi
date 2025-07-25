"use client";

import { useState, useEffect } from "react";

interface VirtualScrollConfig {
  itemsPerRow: number;
  itemHeight: number;
  containerHeight: number;
}

export const useVirtualScrollConfig = (): VirtualScrollConfig => {
  const [config, setConfig] = useState<VirtualScrollConfig>({
    itemsPerRow: 3,
    itemHeight: 320,
    containerHeight: 800,
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        // Mobile: 1 column
        setConfig({
          itemsPerRow: 1,
          itemHeight: 300,
          containerHeight: Math.min(window.innerHeight - 200, 600),
        });
      } else if (width < 1024) {
        // Tablet: 2 columns
        setConfig({
          itemsPerRow: 2,
          itemHeight: 320,
          containerHeight: Math.min(window.innerHeight - 150, 700),
        });
      } else {
        // Desktop: 3 columns
        setConfig({
          itemsPerRow: 3,
          itemHeight: 320,
          containerHeight: Math.min(window.innerHeight - 100, 800),
        });
      }
    };

    // Initial setup
    updateConfig();

    // Listen for window resize
    window.addEventListener("resize", updateConfig);

    return () => {
      window.removeEventListener("resize", updateConfig);
    };
  }, []);

  return config;
};
