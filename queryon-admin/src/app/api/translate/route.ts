import { NextRequest, NextResponse } from "next/server";
import { translateText, translateTexts, detectLanguage } from "@/lib/translate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, targetLanguage, sourceLanguage, action } = body;

    switch (action) {
      case "translate":
        if (text) {
          const translation = await translateText(
            text,
            targetLanguage,
            sourceLanguage
          );
          return NextResponse.json({ translation });
        }
        if (texts && Array.isArray(texts)) {
          const translations = await translateTexts(
            texts,
            targetLanguage,
            sourceLanguage
          );
          return NextResponse.json({ translations });
        }
        break;

      case "detect":
        if (text) {
          const language = await detectLanguage(text);
          return NextResponse.json({ language });
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
