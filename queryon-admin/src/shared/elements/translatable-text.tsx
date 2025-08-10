"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "@/contexts";
import { useWebsiteTranslation } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

interface TranslatableTextProps {
  text: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  className?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  style?: React.CSSProperties;
}

export default function TranslatableText({
  text,
  as: Component = "span",
  className,
  showSkeleton = true,
  skeletonClassName,
  style = {},
}: TranslatableTextProps) {
  const [translatedText, setTranslatedText] = useState(text);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const { currentLanguage, translationCache, isInitialized } = useTranslation();
  const { registerText } = useWebsiteTranslation();
  const hasRegistered = useRef(false);

  // Generate cache key
  const getCacheKey = useCallback((text: string, lang: string) => {
    return `${text}:${lang}`;
  }, []);

  // Watch for cache changes using translationCache as dependency
  useEffect(() => {
    if (!isInitialized || currentLanguage === "en" || !text.trim()) {
      setTranslatedText(text);
      setIsTextLoading(false);
      hasRegistered.current = false;
      return;
    }

    const cacheKey = getCacheKey(text, currentLanguage);
    const cachedTranslation = translationCache.get(cacheKey);

    if (cachedTranslation) {
      // Translation found in cache
      setTranslatedText(cachedTranslation);
      setIsTextLoading(false);
      hasRegistered.current = false;
    } else if (!hasRegistered.current) {
      // Not in cache and haven't registered yet
      setIsTextLoading(true);
      registerText(text);
      hasRegistered.current = true;
    }
  }, [
    text,
    currentLanguage,
    translationCache,
    getCacheKey,
    registerText,
    isInitialized,
  ]);

  // Reset registration flag when language changes
  useEffect(() => {
    hasRegistered.current = false;
  }, [currentLanguage]);

  // Show skeleton only when this specific text is loading
  if (
    showSkeleton &&
    isTextLoading &&
    currentLanguage !== "en" &&
    isInitialized
  ) {
    const skeletonWidth = Math.min(Math.max(text.length * 8, 60), 300);

    return (
      <Skeleton
        className={`inline-block ${skeletonClassName || ""}`}
        style={{
          width: `${skeletonWidth}px`,
          height: Component === "span" ? "1.2em" : "1.5em",
          minHeight: "1em",
        }}
      />
    );
  }

  return (
    <Component className={className} style={style}>
      {translatedText}
    </Component>
  );
}
