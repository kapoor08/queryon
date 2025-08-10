"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWebsiteTranslation } from "@/hooks";

interface WebsiteTranslationContextType {
  registerText: (text: string) => void;
  isWebsiteTranslating: boolean;
}

const WebsiteTranslationContext = createContext<
  WebsiteTranslationContextType | undefined
>(undefined);

export function WebsiteTranslationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { registerText, isWebsiteTranslating } = useWebsiteTranslation();

  return (
    <WebsiteTranslationContext.Provider
      value={{
        registerText,
        isWebsiteTranslating,
      }}
    >
      {children}
    </WebsiteTranslationContext.Provider>
  );
}

export const useWebsiteTranslationContext = () => {
  const context = useContext(WebsiteTranslationContext);
  if (context === undefined) {
    throw new Error(
      "useWebsiteTranslationContext must be used within a WebsiteTranslationProvider"
    );
  }
  return context;
};
