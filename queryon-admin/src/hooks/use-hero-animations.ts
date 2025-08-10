"use client";
import { MousePos } from "@/types/base";
import { useState, useEffect, useCallback, useMemo } from "react";

export function useHeroAnimations() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState<MousePos>({ x: 50, y: 50 });
  const [activeDemo, setActiveDemo] = useState(0);

  // Mouse tracking (throttled with requestAnimationFrame)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    });
  }, []);

  // Auto-cycle demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mount effect
  useEffect(() => {
    setIsLoaded(true);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Background transform
  const backgroundTransform = useMemo(
    () => ({
      transform: `translate3d(${mousePos.x * 0.02}px, ${
        mousePos.y * 0.02
      }px, 0)`,
    }),
    [mousePos.x, mousePos.y]
  );

  // Grid transform
  const gridTransform = useMemo(
    () => ({
      transform: `translate3d(${mousePos.x * 0.05}px, ${
        mousePos.y * 0.05
      }px, 0)`,
    }),
    [mousePos.x, mousePos.y]
  );

  return {
    isLoaded,
    mousePos,
    activeDemo,
    setActiveDemo,
    backgroundTransform,
    gridTransform,
  };
}
