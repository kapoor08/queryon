/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";

interface Options extends IntersectionObserverInit {
  /**
   * Delay in ms between each visible index (stagger animation)
   */
  staggerDelay?: number;
}

/**
 * Custom hook for observing when elements come into view
 * @param itemsCount - number of items to track (optional)
 * @param options - IntersectionObserver options + optional staggerDelay
 */
export function useIntersectionObserver(
  itemsCount?: number,
  options?: Options
) {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (itemsCount && itemsCount > 0) {
              // Handle staggered visibility for multiple items
              Array.from({ length: itemsCount }).forEach((_, index) => {
                setTimeout(() => {
                  setVisibleIndexes((prev) =>
                    prev.includes(index) ? prev : [...prev, index]
                  );
                }, (options?.staggerDelay || 0) * index);
              });
            } else {
              // If only tracking the container
              setVisibleIndexes([0]);
            }
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [itemsCount, options?.staggerDelay, options?.threshold]);

  return { containerRef, visibleIndexes };
}
