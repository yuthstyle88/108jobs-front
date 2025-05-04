"use client";
import { useEffect, useState } from "react";

export const useScrollHandler = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const currentScrollY = window.scrollY;
      const isSmallScreen = window.innerWidth <= 1280; // lg breakpoint
      setScrollY(currentScrollY);

      if (isSmallScreen) {
        setShowSearch(true);
      } else {
        setShowSearch(currentScrollY > window.innerHeight / 2);
      }
    };

    window.addEventListener("scroll", updateState);
    window.addEventListener("resize", updateState);
    updateState(); // run once on mount

    return () => {
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  return { scrollY, showSearch };
};
