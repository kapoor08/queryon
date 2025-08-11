"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/contexts";

// Global registry to collect all texts that need translation
const textRegistry = new Set<string>();
let isCollecting = false;
let collectionTimeout: NodeJS.Timeout | null = null;

export function useWebsiteTranslation() {
  const [isWebsiteTranslating, setIsWebsiteTranslating] = useState(false);
  const { currentLanguage, translateTexts, isInitialized } = useTranslation();

  // Function to register text for translation
  const registerText = useCallback(
    (text: string) => {
      if (currentLanguage === "en" || !text.trim()) return;

      textRegistry.add(text);

      // Start collecting period if not already started
      if (!isCollecting) {
        isCollecting = true;
        setIsWebsiteTranslating(true);

        // Clear any existing timeout
        if (collectionTimeout) {
          clearTimeout(collectionTimeout);
        }

        // Set timeout to process all collected texts
        collectionTimeout = setTimeout(async () => {
          if (textRegistry.size > 0) {
            const textsArray = Array.from(textRegistry);

            try {
              // Translate all collected texts in one batch
              await translateTexts(textsArray);
            } catch (error) {
              console.error("Website translation error:", error);
            }
          }

          // Reset collection state
          textRegistry.clear();
          isCollecting = false;
          setIsWebsiteTranslating(false);
        }, 200); // 200ms delay to collect all texts
      }
    },
    [currentLanguage, translateTexts],
  );

  // Clear registry when language changes
  useEffect(() => {
    textRegistry.clear();
    isCollecting = false;
    setIsWebsiteTranslating(false);

    if (collectionTimeout) {
      clearTimeout(collectionTimeout);
      collectionTimeout = null;
    }
  }, [currentLanguage]);

  return {
    registerText,
    isWebsiteTranslating: isWebsiteTranslating && isInitialized,
  };
}
