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
    itemHeight: 520,
    containerHeight: 800,
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setConfig({
          itemsPerRow: 1,
          itemHeight: 450,
          containerHeight: Math.min(window.innerHeight - 200, 600),
        });
      } else if (width < 1024) {
        setConfig({
          itemsPerRow: 2,
          itemHeight: 480,
          containerHeight: Math.min(window.innerHeight - 150, 700),
        });
      } else {
        setConfig({
          itemsPerRow: 3,
          itemHeight: 520,
          containerHeight: Math.min(window.innerHeight - 100, 800),
        });
      }
    };

    updateConfig();

    window.addEventListener("resize", updateConfig);

    return () => {
      window.removeEventListener("resize", updateConfig);
    };
  }, []);

  return config;
};

