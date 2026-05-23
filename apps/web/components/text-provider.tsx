"use client";

import React, { createContext, useContext, useMemo } from "react";
import { textFallbacks } from "@/texts/defaults";

const TextsContext = createContext<any>(textFallbacks);

interface TextProviderProps {
  initialTexts: {
    landing?: Record<string, unknown> | null;
    docs?: Record<string, unknown> | null;
    section_builder?: Record<string, unknown> | null;
  } | null;
  children: React.ReactNode;
}

export function TextProvider({ initialTexts, children }: TextProviderProps) {
  const mergedTexts = useMemo(() => {
    return {
      ...textFallbacks,
      ...(initialTexts?.landing ?? {}),
      ...(initialTexts?.docs ?? {}),
      ...(initialTexts?.section_builder ?? {}),
    };
  }, [initialTexts]);

  return (
    <TextsContext.Provider value={mergedTexts}>
      {children}
    </TextsContext.Provider>
  );
}

export function useTexts() {
  const context = useContext(TextsContext);
  if (context === undefined) {
    throw new Error("useTexts must be used within a TextProvider");
  }
  return context;
}
