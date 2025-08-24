"use client";

import { createContext, useContext, ReactNode } from "react";

interface AppContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {children}
    </div>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
