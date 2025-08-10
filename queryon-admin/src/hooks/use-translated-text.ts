"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/contexts";

export function useTranslatedText(originalText: string) {
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage, registerTextForTranslation, translationCache } =
    useTranslation();

  // Create cache key
  const getCacheKey = useCallback((text: string, lang: string) => {
    return `${text}:${lang}`;
  }, []);

  useEffect(() => {
    // Reset to original text if language is English
    if (currentLanguage === "en") {
      setTranslatedText(originalText);
      setIsLoading(false);
      return;
    }

    // Don't translate empty strings
    if (!originalText.trim()) {
      setTranslatedText(originalText);
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cacheKey = getCacheKey(originalText, currentLanguage);
    const cachedTranslation = translationCache.get(cacheKey);

    if (cachedTranslation) {
      setTranslatedText(cachedTranslation);
      setIsLoading(false);
      return;
    }

    // Register for batch translation
    setIsLoading(true);
    registerTextForTranslation(originalText)
      .then((translation) => {
        setTranslatedText(translation);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Translation error:", error);
        setTranslatedText(originalText);
        setIsLoading(false);
      });
  }, [
    originalText,
    currentLanguage,
    registerTextForTranslation,
    translationCache,
    getCacheKey,
  ]);

  return { translatedText, isLoading };
}
