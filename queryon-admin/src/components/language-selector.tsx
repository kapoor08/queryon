'use client';

import { Globe, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Updated language list with correct Google Translate codes
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-cn', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, isTranslating, isInitialized } =
    useTranslation();

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
  };

  // Show skeleton loader while initializing from cookie
  if (!isInitialized) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-[140px]" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
        disabled={isTranslating}
      >
        <SelectTrigger className="w-[150px] h-9 cursor-pointer">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue>
              <div className="flex items-center gap-1">
                <span>{currentLang?.flag}</span>
                <span className="hidden sm:inline">{currentLang?.name}</span>
                <span className="sm:hidden">
                  {currentLang?.code.toUpperCase()}
                </span>
              </div>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="!h-[200px]">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2 cursor-pointer">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({lang.code})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isTranslating && (
        <Badge variant="secondary" className="animate-pulse">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <span className="text-xs">Translating...</span>
        </Badge>
      )}
    </div>
  );
};

export default LanguageSelector;
