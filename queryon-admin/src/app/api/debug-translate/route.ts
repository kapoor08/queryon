import { NextRequest, NextResponse } from "next/server";
import { translateText, translateTexts, detectLanguage } from "@/lib/translate";

// Valid language codes supported by Google Translate
const SUPPORTED_LANGUAGES = [
  "af",
  "sq",
  "am",
  "ar",
  "hy",
  "az",
  "eu",
  "be",
  "bn",
  "bs",
  "bg",
  "ca",
  "ceb",
  "ny",
  "zh",
  "zh-cn",
  "zh-tw",
  "co",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "eo",
  "et",
  "tl",
  "fi",
  "fr",
  "fy",
  "gl",
  "ka",
  "de",
  "el",
  "gu",
  "ht",
  "ha",
  "haw",
  "iw",
  "he",
  "hi",
  "hmn",
  "hu",
  "is",
  "ig",
  "id",
  "ga",
  "it",
  "ja",
  "jw",
  "kn",
  "kk",
  "km",
  "ko",
  "ku",
  "ky",
  "lo",
  "la",
  "lv",
  "lt",
  "lb",
  "mk",
  "mg",
  "ms",
  "ml",
  "mt",
  "mi",
  "mr",
  "mn",
  "my",
  "ne",
  "no",
  "or",
  "ps",
  "fa",
  "pl",
  "pt",
  "pa",
  "ro",
  "ru",
  "sm",
  "gd",
  "sr",
  "st",
  "sn",
  "sd",
  "si",
  "sk",
  "sl",
  "so",
  "es",
  "su",
  "sw",
  "sv",
  "tg",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "ur",
  "ug",
  "uz",
  "vi",
  "cy",
  "xh",
  "yi",
  "yo",
  "zu",
];

function debugLog(message: string, data?: unknown) {
  console.log(`[API DEBUG] ${message}`, data || "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, targetLanguage, sourceLanguage, action } = body;

    debugLog("=== API Request Received ===");
    debugLog("Raw body:", body);
    debugLog("Parsed parameters:", {
      action,
      text: text?.substring(0, 50) + (text?.length > 50 ? "..." : ""),
      textLength: text?.length,
      textsCount: texts?.length,
      targetLanguage,
      sourceLanguage,
      hasText: !!text,
      hasTexts: !!texts,
    });

    // Validate action
    if (!action) {
      debugLog("ERROR: Missing action parameter");
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    if (!["translate", "detect"].includes(action)) {
      debugLog("ERROR: Invalid action:", action);
      return NextResponse.json(
        { error: `Invalid action: ${action}` },
        { status: 400 }
      );
    }

    if (action === "translate") {
      // Validate target language
      if (!targetLanguage) {
        debugLog("ERROR: Missing target language");
        return NextResponse.json(
          { error: "Target language is required" },
          { status: 400 }
        );
      }

      // Normalize language codes
      const normalizedTarget = targetLanguage.toLowerCase();
      const normalizedSource = sourceLanguage?.toLowerCase() || "auto";

      debugLog("Language validation:", {
        originalTarget: targetLanguage,
        normalizedTarget,
        originalSource: sourceLanguage,
        normalizedSource,
        targetSupported: SUPPORTED_LANGUAGES.includes(normalizedTarget),
        sourceSupported:
          normalizedSource === "auto" ||
          SUPPORTED_LANGUAGES.includes(normalizedSource),
      });

      // Validate language codes
      if (!SUPPORTED_LANGUAGES.includes(normalizedTarget)) {
        debugLog("ERROR: Unsupported target language:", normalizedTarget);
        return NextResponse.json(
          {
            error: `Unsupported target language: ${targetLanguage}`,
            supportedLanguages: SUPPORTED_LANGUAGES.slice(0, 20), // Show first 20 for reference
          },
          { status: 400 }
        );
      }

      if (
        normalizedSource !== "auto" &&
        !SUPPORTED_LANGUAGES.includes(normalizedSource)
      ) {
        debugLog("ERROR: Unsupported source language:", normalizedSource);
        return NextResponse.json(
          {
            error: `Unsupported source language: ${sourceLanguage}`,
          },
          { status: 400 }
        );
      }

      // Handle single text translation
      if (text) {
        debugLog("Processing single text translation...");

        // Validate text
        if (typeof text !== "string") {
          debugLog("ERROR: Text must be a string, got:", typeof text);
          return NextResponse.json(
            { error: "Text must be a string" },
            { status: 400 }
          );
        }

        if (!text.trim()) {
          debugLog("Empty text, returning as-is");
          return NextResponse.json({ translation: text });
        }

        // Check for potential encoding issues
        try {
          const testEncode = encodeURIComponent(text);
          debugLog("Text encoding test passed, length:", testEncode.length);
        } catch (encodeError) {
          debugLog("ERROR: Text encoding failed:", encodeError);
          return NextResponse.json(
            { error: "Invalid text encoding" },
            { status: 400 }
          );
        }

        try {
          debugLog("Calling translateText function...");
          const translation = await translateText(
            text,
            normalizedTarget,
            normalizedSource
          );

          debugLog("Translation completed:", {
            original: text.substring(0, 30),
            translated: translation.substring(0, 30),
            success: translation !== text,
            originalLength: text.length,
            translatedLength: translation.length,
          });

          return NextResponse.json({
            translation,
            original: text,
            targetLanguage: normalizedTarget,
            sourceLanguage: normalizedSource,
            success: translation !== text,
          });
        } catch (translationError) {
          debugLog("Translation function error:", translationError);
          return NextResponse.json(
            {
              error: "Translation failed",
              details:
                translationError instanceof Error
                  ? translationError.message
                  : "Unknown error",
            },
            { status: 500 }
          );
        }
      }

      // Handle multiple texts translation
      if (texts && Array.isArray(texts)) {
        debugLog("Processing bulk text translation...");

        // Validate texts array
        for (let i = 0; i < texts.length; i++) {
          if (typeof texts[i] !== "string") {
            debugLog(
              `ERROR: Text at index ${i} is not a string:`,
              typeof texts[i]
            );
            return NextResponse.json(
              {
                error: `Text at index ${i} must be a string`,
              },
              { status: 400 }
            );
          }
        }

        try {
          const translations = await translateTexts(
            texts,
            normalizedTarget,
            normalizedSource
          );

          return NextResponse.json({
            translations,
            original: texts,
            targetLanguage: normalizedTarget,
            sourceLanguage: normalizedSource,
          });
        } catch (translationError) {
          debugLog("Bulk translation error:", translationError);
          return NextResponse.json(
            {
              error: "Bulk translation failed",
              details:
                translationError instanceof Error
                  ? translationError.message
                  : "Unknown error",
            },
            { status: 500 }
          );
        }
      }

      debugLog("ERROR: Neither text nor texts provided");
      return NextResponse.json(
        { error: "Either 'text' or 'texts' parameter is required" },
        { status: 400 }
      );
    }

    if (action === "detect") {
      if (!text) {
        debugLog("ERROR: Text required for detection");
        return NextResponse.json(
          { error: "Text parameter is required for detection" },
          { status: 400 }
        );
      }

      if (typeof text !== "string") {
        debugLog("ERROR: Detection text must be string, got:", typeof text);
        return NextResponse.json(
          { error: "Text must be a string" },
          { status: 400 }
        );
      }

      try {
        const language = await detectLanguage(text);
        return NextResponse.json({ language });
      } catch (detectionError) {
        debugLog("Detection error:", detectionError);
        return NextResponse.json(
          {
            error: "Language detection failed",
            details:
              detectionError instanceof Error
                ? detectionError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    debugLog("General API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
