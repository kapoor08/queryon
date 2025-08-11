// Language code mapping for Google Translate API
export const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: 'en', // English
  es: 'es', // Spanish
  fr: 'fr', // French
  de: 'de', // German
  it: 'it', // Italian
  pt: 'pt', // Portuguese
  ru: 'ru', // Russian
  ja: 'ja', // Japanese
  ko: 'ko', // Korean
  zh: 'zh-cn', // Chinese (Simplified) - This might be the issue!
  'zh-CN': 'zh-cn',
  'zh-cn': 'zh-cn',
  hi: 'hi', // Hindi
  ar: 'ar', // Arabic
  th: 'th', // Thai
  vi: 'vi', // Vietnamese
  nl: 'nl', // Dutch
  pl: 'pl', // Polish
  sv: 'sv', // Swedish
  tr: 'tr', // Turkish
};

// Valid Google Translate language codes
export const SUPPORTED_LANGUAGES = [
  'af',
  'sq',
  'am',
  'ar',
  'hy',
  'az',
  'eu',
  'be',
  'bn',
  'bs',
  'bg',
  'ca',
  'ceb',
  'ny',
  'zh-cn',
  'zh-tw',
  'co',
  'hr',
  'cs',
  'da',
  'nl',
  'en',
  'eo',
  'et',
  'tl',
  'fi',
  'fr',
  'fy',
  'gl',
  'ka',
  'de',
  'el',
  'gu',
  'ht',
  'ha',
  'haw',
  'he',
  'hi',
  'hmn',
  'hu',
  'is',
  'ig',
  'id',
  'ga',
  'it',
  'ja',
  'jw',
  'kn',
  'kk',
  'km',
  'ko',
  'ku',
  'ky',
  'lo',
  'la',
  'lv',
  'lt',
  'lb',
  'mk',
  'mg',
  'ms',
  'ml',
  'mt',
  'mi',
  'mr',
  'mn',
  'my',
  'ne',
  'no',
  'or',
  'ps',
  'fa',
  'pl',
  'pt',
  'pa',
  'ro',
  'ru',
  'sm',
  'gd',
  'sr',
  'st',
  'sn',
  'sd',
  'si',
  'sk',
  'sl',
  'so',
  'es',
  'su',
  'sw',
  'sv',
  'tg',
  'ta',
  'te',
  'th',
  'tr',
  'uk',
  'ur',
  'ug',
  'uz',
  'vi',
  'cy',
  'xh',
  'yi',
  'yo',
  'zu',
];

export function normalizeLanguageCode(code: string): string {
  if (!code) return 'auto';

  const lowerCode = code.toLowerCase();

  // Check if it's already a valid Google Translate code
  if (SUPPORTED_LANGUAGES.includes(lowerCode)) {
    return lowerCode;
  }

  // Try to map it
  if (LANGUAGE_CODE_MAP[lowerCode]) {
    return LANGUAGE_CODE_MAP[lowerCode];
  }

  // Special cases
  if (lowerCode === 'zh' || lowerCode === 'chinese') {
    return 'zh-cn';
  }

  if (lowerCode === 'auto' || lowerCode === 'detect') {
    return 'auto';
  }

  // Return original if no mapping found
  return lowerCode;
}

export function isValidLanguageCode(code: string): boolean {
  if (!code) return false;

  const normalized = normalizeLanguageCode(code);
  return normalized === 'auto' || SUPPORTED_LANGUAGES.includes(normalized);
}
