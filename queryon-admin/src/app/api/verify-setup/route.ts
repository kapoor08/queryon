// Create this file: src/app/api/verify-setup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Translate } from "@google-cloud/translate/build/src/v2";

interface GoogleCloudError extends Error {
  code?: number | string;
  status?: number;
  details?: string;
  errors?: Array<{
    message: string;
    domain: string;
    reason: string;
  }>;
}

export async function GET(request: NextRequest) {
  const logs: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function log(message: string, data?: any) {
    const logEntry = data
      ? `${message} ${JSON.stringify(data, null, 2)}`
      : message;
    console.log(logEntry);
    logs.push(logEntry);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let serviceAccountKey: any;

  try {
    log("=== Google Cloud Setup Verification ===");

    // Check environment variables
    log("Environment Variables:");
    log("- GOOGLE_CLOUD_PROJECT_ID:", process.env.GOOGLE_CLOUD_PROJECT_ID);
    log(
      "- GOOGLE_SERVICE_ACCOUNT_KEY exists:",
      !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    );

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json(
        {
          error:
            "GOOGLE_SERVICE_ACCOUNT_KEY not found in environment variables",
          logs,
        },
        { status: 500 }
      );
    }

    // Parse and validate service account key
    try {
      serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      log("Service Account Info:");
      log("- Email:", serviceAccountKey.client_email);
      log("- Project ID in key:", serviceAccountKey.project_id);
      log("- Private key exists:", !!serviceAccountKey.private_key);
      log("- Key type:", serviceAccountKey.type);
    } catch (parseError) {
      log("Failed to parse service account key:", parseError);
      return NextResponse.json(
        {
          error: "Invalid service account key format",
          logs,
        },
        { status: 500 }
      );
    }

    // Check project ID consistency
    if (serviceAccountKey.project_id !== process.env.GOOGLE_CLOUD_PROJECT_ID) {
      log("WARNING: Project ID mismatch!");
      log("- Environment variable:", process.env.GOOGLE_CLOUD_PROJECT_ID);
      log("- Service account key:", serviceAccountKey.project_id);
    }

    // Test Google Cloud Translation API initialization
    log("Testing Google Cloud Translation API...");

    try {
      const translate = new Translate({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials: serviceAccountKey,
      });

      log("Translate client created successfully");

      // Test with a very simple translation
      log("Testing simple translation: 'Hello' -> Spanish");

      const [translation] = await translate.translate("Hello", {
        from: "en",
        to: "es",
      });

      log("Translation test result:", {
        original: "Hello",
        translated: translation,
        success: translation !== "Hello" && translation === "Hola",
      });

      // Test language detection
      log("Testing language detection for 'Bonjour'");
      const [detection] = await translate.detect("Bonjour");
      const detectedLang = Array.isArray(detection)
        ? detection[0].language
        : detection.language;
      log("Detection result:", detectedLang);

      return NextResponse.json({
        success: true,
        message: "Google Cloud setup is working correctly!",
        testResults: {
          translation: {
            original: "Hello",
            translated: translation,
            success: translation === "Hola",
          },
          detection: {
            text: "Bonjour",
            detected: detectedLang,
            success: detectedLang === "fr",
          },
        },
        serviceAccount: {
          email: serviceAccountKey.client_email,
          projectId: serviceAccountKey.project_id,
        },
        logs,
      });
    } catch (apiError) {
      log("Google Cloud API Error:", apiError);

      if (apiError instanceof Error) {
        const gcError = apiError as GoogleCloudError;

        log("Error details:", {
          name: apiError.name,
          message: apiError.message,
          code: gcError.code,
          status: gcError.status,
          details: gcError.details,
          errors: gcError.errors,
        });

        // Specific error handling
        if (gcError.code === 403) {
          return NextResponse.json(
            {
              error:
                "Permission Denied - Service account lacks required permissions",
              solution:
                "Add 'Cloud Translation API User' role to your service account",
              serviceAccountEmail: serviceAccountKey?.client_email,
              logs,
            },
            { status: 403 }
          );
        }

        if (gcError.code === 400) {
          return NextResponse.json(
            {
              error:
                "Bad Request - API might not be enabled or invalid parameters",
              solution: "Enable Cloud Translation API in Google Cloud Console",
              projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
              logs,
            },
            { status: 400 }
          );
        }

        if (gcError.code === 429) {
          return NextResponse.json(
            {
              error: "Quota Exceeded - API quota limits reached",
              solution: "Check your API usage limits in Google Cloud Console",
              logs,
            },
            { status: 429 }
          );
        }

        if (apiError.message?.includes("billing")) {
          return NextResponse.json(
            {
              error:
                "Billing Required - Enable billing for your Google Cloud project",
              solution: "Enable billing in Google Cloud Console",
              projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
              logs,
            },
            { status: 402 }
          );
        }
      }

      return NextResponse.json(
        {
          error: "Google Cloud API test failed",
          details:
            apiError instanceof Error ? apiError.message : "Unknown error",
          logs,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    log("General error:", error);
    return NextResponse.json(
      {
        error: "Setup verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        logs,
      },
      { status: 500 }
    );
  }
}
