'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { getLanguageFromCookie, setLanguageCookie } from '@/lib/cookie';

interface TranslationEntry {
  id: string;
  originalText: string;
  translatedText?: string;
  isLoading: boolean;
  resolve?: (text: string) => void;
}

interface TranslationContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  translateText: (text: string, targetLang?: string) => Promise<string>;
  translateTexts: (texts: string[], targetLang?: string) => Promise<string[]>;
  registerTextForTranslation: (text: string) => Promise<string>;
  isTranslating: boolean;
  translationCache: Record<string, string> | Map<string, string>;
  clearCache: () => void;
  isInitialized: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Start with default values that match server-side rendering
  const [currentLanguage, setCurrentLanguageState] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<
    Record<string, string>
  >({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Batching mechanism - using useRef to avoid hydration issues
  const pendingTranslations = useRef<Map<string, TranslationEntry>>(new Map());
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const BATCH_DELAY = 100;

  // Handle mounting and language initialization
  useEffect(() => {
    setIsMounted(true);
    const savedLanguage = getLanguageFromCookie();
    setCurrentLanguageState(savedLanguage);
    setIsInitialized(true);
  }, []);

  // Custom setter that updates both state and cookie
  const setCurrentLanguage = useCallback(
    (language: string) => {
      setCurrentLanguageState(language);
      if (isMounted) {
        setLanguageCookie(language);
      }
      // Clear cache when language changes
      setTranslationCache({});
    },
    [isMounted]
  );

  // Memoize cache key function
  const getCacheKey = useCallback((text: string, targetLang: string) => {
    return `${text}:${targetLang}`;
  }, []);

  const clearCache = useCallback(() => {
    setTranslationCache({});
  }, []);

  // Process batch of translations
  const processBatch = useCallback(async () => {
    if (!isMounted || pendingTranslations.current.size === 0) return;

    const entries = Array.from(pendingTranslations.current.values());
    const textsToTranslate = entries.map((entry) => entry.originalText);

    setIsTranslating(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLanguage: currentLanguage,
          action: 'translate',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const translations = data.translations || textsToTranslate;

      // Update cache and resolve promises
      setTranslationCache((prevCache) => {
        const newCache = { ...prevCache };

        entries.forEach((entry, index) => {
          const translatedText = translations[index] || entry.originalText;
          const cacheKey = getCacheKey(entry.originalText, currentLanguage);

          // Update cache
          newCache[cacheKey] = translatedText;

          // Resolve the promise
          if (entry.resolve) {
            entry.resolve(translatedText);
          }
        });

        return newCache;
      });
    } catch (error) {
      console.error('Batch translation error:', error);

      // Resolve with original texts on error
      entries.forEach((entry) => {
        if (entry.resolve) {
          entry.resolve(entry.originalText);
        }
      });
    } finally {
      setIsTranslating(false);
      pendingTranslations.current.clear();
    }
  }, [currentLanguage, getCacheKey, isMounted]);

  // Register text for batch translation
  const registerTextForTranslation = useCallback(
    (text: string): Promise<string> => {
      // Return immediately if not mounted or language is English
      if (!isMounted || currentLanguage === 'en') {
        return Promise.resolve(text);
      }

      // Check cache first
      const cacheKey = getCacheKey(text, currentLanguage);
      const cachedTranslation = translationCache[cacheKey];
      if (cachedTranslation) {
        return Promise.resolve(cachedTranslation);
      }

      // Return promise that will be resolved when batch is processed
      return new Promise<string>((resolve) => {
        const id = `${text}-${Date.now()}-${Math.random()}`;

        pendingTranslations.current.set(id, {
          id,
          originalText: text,
          isLoading: true,
          resolve,
        });

        // Clear existing timeout and set new one
        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }

        batchTimeoutRef.current = setTimeout(() => {
          processBatch();
        }, BATCH_DELAY);
      });
    },
    [currentLanguage, translationCache, getCacheKey, processBatch, isMounted]
  );

  // Memoize translateText to prevent infinite re-renders
  const translateText = useCallback(
    async (text: string, targetLang?: string): Promise<string> => {
      if (!isMounted) return text;

      const targetLanguage = targetLang || currentLanguage;

      if (targetLanguage === 'en') return text;
      if (!text.trim()) return text;

      // Check cache first
      const cacheKey = getCacheKey(text, targetLanguage);
      const cached = translationCache[cacheKey];
      if (cached) return cached;

      setIsTranslating(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            targetLanguage,
            action: 'translate',
          }),
        });

        const data = await response.json();
        const translation = data.translation || text;

        // Update cache immutably
        setTranslationCache((prev) => ({
          ...prev,
          [cacheKey]: translation,
        }));

        return translation;
      } catch (error) {
        console.error('Translation error:', error);
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [currentLanguage, getCacheKey, translationCache, isMounted]
  );

  // Memoize translateTexts to prevent infinite re-renders
  const translateTexts = useCallback(
    async (texts: string[], targetLang?: string): Promise<string[]> => {
      if (!isMounted) return texts;

      const targetLanguage = targetLang || currentLanguage;

      if (targetLanguage === 'en') return texts;
      if (!texts.length) return texts;

      // Check cache for all texts
      const cacheResults: string[] = new Array(texts.length);
      const textsToTranslate: string[] = [];
      const indicesToTranslate: number[] = [];

      texts.forEach((text, index) => {
        const cacheKey = getCacheKey(text, targetLanguage);
        const cached = translationCache[cacheKey];

        if (cached) {
          cacheResults[index] = cached;
        } else {
          textsToTranslate.push(text);
          indicesToTranslate.push(index);
        }
      });

      // If all texts are cached, return immediately
      if (textsToTranslate.length === 0) {
        return cacheResults;
      }

      setIsTranslating(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: textsToTranslate,
            targetLanguage,
            action: 'translate',
          }),
        });

        const data = await response.json();
        const translations = data.translations || textsToTranslate;

        // Update cache with new translations
        setTranslationCache((prevCache) => {
          const newCache = { ...prevCache };

          textsToTranslate.forEach((text, index) => {
            const cacheKey = getCacheKey(text, targetLanguage);
            const translation = translations[index] || text;
            newCache[cacheKey] = translation;
            cacheResults[indicesToTranslate[index]] = translation;
          });

          return newCache;
        });

        return cacheResults;
      } catch (error) {
        console.error('Translation error:', error);
        // Fill missing translations with original texts
        indicesToTranslate.forEach((originalIndex, translationIndex) => {
          cacheResults[originalIndex] = textsToTranslate[translationIndex];
        });
        return cacheResults;
      } finally {
        setIsTranslating(false);
      }
    },
    [currentLanguage, getCacheKey, translationCache, isMounted]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentLanguage,
      setCurrentLanguage,
      translateText,
      translateTexts,
      registerTextForTranslation,
      isTranslating,
      translationCache,
      clearCache,
      isInitialized,
    }),
    [
      currentLanguage,
      setCurrentLanguage,
      translateText,
      translateTexts,
      registerTextForTranslation,
      isTranslating,
      translationCache,
      isInitialized,
      clearCache,
    ]
  );

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
