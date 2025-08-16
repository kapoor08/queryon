'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/contexts';
import { useWebsiteTranslation } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';

interface TranslatableTextProps {
  text: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  className?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  style?: React.CSSProperties;
}

export default function TranslatableText({
  text,
  as: Component = 'span',
  className,
  showSkeleton = true,
  skeletonClassName,
  style = {},
}: TranslatableTextProps) {
  const [translatedText, setTranslatedText] = useState(text);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { currentLanguage, translationCache, isInitialized } = useTranslation();
  const { registerText } = useWebsiteTranslation();
  const hasRegistered = useRef(false);

  // Handle mounting to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate cache key
  const getCacheKey = useCallback((text: string, lang: string) => {
    return `${text}:${lang}`;
  }, []);

  // Watch for cache changes using translationCache as dependency
  useEffect(() => {
    if (
      !isInitialized ||
      !isMounted ||
      currentLanguage === 'en' ||
      !text.trim()
    ) {
      setTranslatedText(text);
      setIsTextLoading(false);
      hasRegistered.current = false;
      return;
    }

    const cacheKey = getCacheKey(text, currentLanguage);
    // Handle both Map and Object cache types
    const cachedTranslation =
      translationCache instanceof Map
        ? translationCache.get(cacheKey)
        : translationCache[cacheKey];

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
    isMounted,
  ]);

  // Reset registration flag when language changes
  useEffect(() => {
    hasRegistered.current = false;
  }, [currentLanguage]);

  // Don't render skeleton on server or before mounting to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Component className={className} style={style}>
        {text}
      </Component>
    );
  }

  // Show skeleton only when this specific text is loading
  if (
    showSkeleton &&
    isTextLoading &&
    currentLanguage !== 'en' &&
    isInitialized &&
    isMounted
  ) {
    const skeletonWidth = Math.min(Math.max(text.length * 8, 60), 300);

    return (
      <Skeleton
        className={`inline-block ${skeletonClassName || ''}`}
        style={{
          width: `${skeletonWidth}px`,
          height: Component === 'span' ? '1.2em' : '1.5em',
          minHeight: '1em',
        }}
      />
    );
  }

  // Check if translatedText contains HTML
  const containsHTML = /<[^>]*>/g.test(translatedText);

  if (containsHTML) {
    // If it contains HTML, use dangerouslySetInnerHTML (no children allowed)
    return (
      <Component
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: translatedText }}
      />
    );
  }

  // If it's plain text, render normally
  return (
    <Component className={className} style={style}>
      {translatedText}
    </Component>
  );
}
