// src/types/Argument.ts

export interface Argument {
  id: string;
  debateId: string;
  userId: string;
  content: string;
  round: number;
  side: "creator" | "opponent";
  createdAt: number;
}

export interface FactCheck {
  claim: string;
  verified: boolean;
  explanation: string;
}

export interface AIAnalysis {
  id: string;  // This is required by TypeScript
  argumentId: string;
  userId: string;
  round: number;
  content: string;
  factCheck: FactCheck[];
  score: number;
  suggestedCounterpoints?: string[];
  createdAt: number;
}