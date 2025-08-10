import { Translate } from "@google-cloud/translate/build/src/v2";

// Enhanced debug logging
function debugLog(message: string, data?: unknown) {
  console.log(`[TRANSLATE DEBUG] ${message}`, data || "");
}

// Google Cloud Error interface
interface GoogleCloudError extends Error {
  code?: number | string;
  status?: number;
  details?: string;
  statusDetails?: unknown[];
  errors?: Array<{
    message: string;
    domain: string;
    reason: string;
  }>;
}

// Initialize the translate client with enhanced debugging
const getTranslateClient = (): Translate | null => {
  debugLog("Starting client initialization...");

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    debugLog(
      "ERROR: GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"
    );
    return null;
  }

  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
    debugLog("ERROR: GOOGLE_CLOUD_PROJECT_ID environment variable is not set");
    return null;
  }

  try {
    const serviceAccountKey = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    );

    debugLog("Service account details:", {
      email: serviceAccountKey.client_email,
      projectId: serviceAccountKey.project_id,
      envProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });

    // Validate that project IDs match
    if (serviceAccountKey.project_id !== process.env.GOOGLE_CLOUD_PROJECT_ID) {
      debugLog("WARNING: Project ID mismatch!", {
        serviceAccount: serviceAccountKey.project_id,
        environment: process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
    }

    // Validate required fields in service account key
    if (!serviceAccountKey.client_email || !serviceAccountKey.private_key) {
      debugLog("ERROR: Service account key missing required fields");
      return null;
    }

    const client = new Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: serviceAccountKey,
    });

    debugLog("Client created successfully");
    return client;
  } catch (error) {
    debugLog("Failed to parse service account key:", error);
    return null;
  }
};

let translate: Translate | null;

try {
  translate = getTranslateClient();
  if (translate) {
    debugLog("Google Translate client initialized successfully");
  } else {
    debugLog("Google Translate client initialization failed");
  }
} catch (error) {
  debugLog("Failed to initialize Google Translate client:", error);
  translate = null;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "auto"
): Promise<string> {
  debugLog("=== Translation Request Started ===");
  debugLog("Input parameters:", {
    text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
    textLength: text.length,
    from: sourceLanguage,
    to: targetLanguage,
  });

  if (!translate) {
    debugLog("ERROR: Google Translate client not initialized");
    return text;
  }

  // Validate inputs
  if (!text || !text.trim()) {
    debugLog("Empty text, returning original");
    return text;
  }

  if (!targetLanguage) {
    debugLog("ERROR: Target language is required");
    return text;
  }

  // Don't translate if target language is the same as source
  if (sourceLanguage === targetLanguage) {
    debugLog("Source and target languages are the same, returning original");
    return text;
  }

  // Don't translate if target language is English and source is auto/en
  if (
    targetLanguage === "en" &&
    (sourceLanguage === "auto" || sourceLanguage === "en")
  ) {
    debugLog("Target is English and source is auto/en, returning original");
    return text;
  }

  try {
    debugLog("Calling Google Translate API...");

    // Make the translation request with explicit parameters
    const translateOptions: { from?: string; to: string } = {
      to: targetLanguage.toLowerCase(),
    };

    // Only set 'from' if it's not 'auto'
    if (sourceLanguage && sourceLanguage !== "auto") {
      translateOptions.from = sourceLanguage.toLowerCase();
    }

    debugLog("Translation options:", translateOptions);

    const [translation] = await translate.translate(text, translateOptions);

    debugLog("API response received:", {
      original: text.substring(0, 50),
      translated: translation?.substring(0, 50),
      originalLength: text.length,
      translatedLength: translation?.length || 0,
      isChanged: translation !== text,
      translationType: typeof translation,
    });

    // Additional validation
    if (translation === undefined || translation === null) {
      debugLog("WARNING: Translation is undefined/null");
      return text;
    }

    if (typeof translation !== "string") {
      debugLog("WARNING: Translation is not a string:", typeof translation);
      return text;
    }

    if (translation === text) {
      debugLog(
        "INFO: Translation is identical to original text (this may be normal)"
      );
    }

    debugLog("=== Translation Request Completed Successfully ===");
    return translation;
  } catch (error) {
    debugLog("ERROR: Translation failed:", error);

    if (error instanceof Error) {
      const gcError = error as GoogleCloudError;
      debugLog("Detailed error information:", {
        name: error.name,
        message: error.message,
        code: gcError.code,
        status: gcError.status,
        details: gcError.details,
        errors: gcError.errors,
        stack: error.stack?.substring(0, 500),
      });

      // Check for specific error codes and provide helpful messages
      if (gcError.code === 403) {
        debugLog(
          "ERROR: Permission denied - Service account lacks 'Cloud Translation API User' role"
        );
      } else if (gcError.code === 400) {
        debugLog("ERROR: Bad request - Check language codes and input text");
        debugLog("Problematic input:", {
          text,
          targetLanguage,
          sourceLanguage,
        });
      } else if (gcError.code === 429) {
        debugLog("ERROR: Quota exceeded - API rate limits reached");
      } else if (gcError.code === 401) {
        debugLog(
          "ERROR: Authentication failed - Check service account credentials"
        );
      }
    }

    return text;
  }
}

export async function translateTexts(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = "auto"
): Promise<string[]> {
  debugLog("=== Bulk Translation Request ===", {
    textsCount: texts.length,
    from: sourceLanguage,
    to: targetLanguage,
  });

  if (!translate) {
    debugLog("ERROR: Google Translate client not initialized");
    return texts;
  }

  try {
    if (!texts || texts.length === 0) {
      debugLog("Empty texts array, returning original");
      return texts;
    }

    // Filter out empty strings
    const filteredTexts = texts.filter((text) => text && text.trim());
    if (filteredTexts.length === 0) {
      debugLog("All texts are empty, returning original array");
      return texts;
    }

    const translateOptions: { from?: string; to: string } = {
      to: targetLanguage.toLowerCase(),
    };

    if (sourceLanguage && sourceLanguage !== "auto") {
      translateOptions.from = sourceLanguage.toLowerCase();
    }

    const [translations] = await translate.translate(
      filteredTexts,
      translateOptions
    );

    const result = Array.isArray(translations) ? translations : [translations];

    debugLog("Bulk translation completed:", {
      originalCount: texts.length,
      filteredCount: filteredTexts.length,
      translatedCount: result.length,
      sample: result[0]?.substring(0, 50),
    });

    // Map results back to original array structure
    let resultIndex = 0;
    const finalResult = texts.map((text) => {
      if (text && text.trim()) {
        return result[resultIndex++] || text;
      }
      return text;
    });

    return finalResult;
  } catch (error) {
    debugLog("Bulk translation error:", error);
    return texts;
  }
}

export async function detectLanguage(text: string): Promise<string> {
  debugLog("Language detection request:", text.substring(0, 50));

  if (!translate) {
    debugLog("ERROR: Google Translate client not initialized");
    return "en";
  }

  if (!text || !text.trim()) {
    debugLog("Empty text for detection, returning 'en'");
    return "en";
  }

  try {
    const [detection] = await translate.detect(text);
    const language = Array.isArray(detection)
      ? detection[0].language
      : detection.language;

    debugLog("Language detected:", language);
    return language || "en";
  } catch (error) {
    debugLog("Language detection error:", error);
    return "en";
  }
}

// Export a function to check if the client is initialized
export function isTranslateClientReady(): boolean {
  return translate !== null;
}

// Export a function to get client status for debugging
export function getClientStatus(): {
  initialized: boolean;
  hasServiceAccountKey: boolean;
  hasProjectId: boolean;
} {
  return {
    initialized: translate !== null,
    hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    hasProjectId: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
  };
}
