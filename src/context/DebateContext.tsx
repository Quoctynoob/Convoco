// src/context/DebateContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Debate } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";

interface DebateContextType {
  currentDebate: Debate | null;
  setCurrentDebate: (debate: Debate | null) => void;
  debateArguments: Argument[];
  setDebateArguments: (args: Argument[]) => void;
  analyses: AIAnalysis[];
  setAnalyses: (analyses: AIAnalysis[]) => void;
}

const DebateContext = createContext<DebateContextType>({
  currentDebate: null,
  setCurrentDebate: () => {},
  debateArguments: [],
  setDebateArguments: () => {},
  analyses: [],
  setAnalyses: () => {},
});

export const DebateProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentDebate, setCurrentDebate] = useState<Debate | null>(null);
  const [debateArguments, setDebateArguments] = useState<Argument[]>([]);
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);

  return (
    <DebateContext.Provider
      value={{
        currentDebate,
        setCurrentDebate,
        debateArguments,
        setDebateArguments,
        analyses,
        setAnalyses,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
};

export const useDebateContext = () => useContext(DebateContext);
