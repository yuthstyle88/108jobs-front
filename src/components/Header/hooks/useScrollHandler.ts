"use client";
import {useEffect, useState} from "react";

export const useScrollHandler = (forceShowSearch: boolean = false) => {
  const [scrollY, setScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
      if (forceShowSearch) {
        setShowSearch(true);
        return; // skip all scroll/resize logic
      }

      const updateState = () => {
        const currentScrollY = window.scrollY;
        const isSmallScreen = window.innerWidth <= 1280;
        setScrollY(currentScrollY);

        if (isSmallScreen) {
          setShowSearch(true);
        } else {
          setShowSearch(currentScrollY > window.innerHeight / 2);
        }
      };

      window.addEventListener("scroll",
        updateState);
      window.addEventListener("resize",
        updateState);
      updateState(); // initial check

      return () => {
        window.removeEventListener("scroll",
          updateState);
        window.removeEventListener("resize",
          updateState);
      };
    },
    [forceShowSearch]);

  return {scrollY, showSearch};
};
