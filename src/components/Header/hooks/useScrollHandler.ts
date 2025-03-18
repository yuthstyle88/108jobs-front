"use client";
import { useEffect, useState } from "react";

export const useScrollHandler = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowSearch(currentScrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, showSearch };
};
