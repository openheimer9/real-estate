"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: string;
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme={defaultTheme}>
      {children}
    </NextThemesProvider>
  );
}