"use client";

import { useWebsiteTranslation } from "@/hooks";
import { useTranslation } from "@/contexts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Globe, Loader2 } from "lucide-react";

const TranslationLoadingIndicator = () => {
  const { isWebsiteTranslating } = useWebsiteTranslation();
  const { currentLanguage, isInitialized } = useTranslation();

  // Don't show for English or before initialization
  if (currentLanguage === "en" || !isInitialized) {
    return null;
  }

  // Only show when actively translating
  if (!isWebsiteTranslating) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Badge
        variant="secondary"
        className="bg-background/90 backdrop-blur-sm border shadow-lg px-4 py-2"
      >
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Translating page...</span>
        </div>
      </Badge>
    </div>
  );
};

// Alternative progress bar version
export function TranslationProgressBar() {
  const { isWebsiteTranslating } = useWebsiteTranslation();
  const { currentLanguage, isInitialized } = useTranslation();

  if (currentLanguage === "en" || !isInitialized || !isWebsiteTranslating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress
        value={undefined} // Indeterminate progress
        className="h-1 rounded-none"
      />
    </div>
  );
}

export default TranslationLoadingIndicator;
