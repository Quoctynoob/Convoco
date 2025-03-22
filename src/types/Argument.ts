// src/types/Argument.ts - Updated AIAnalysis interface
export interface Argument {
  id: string;
  debateId: string;
  userId: string;
  content: string;
  round: number;
  side: "creator" | "opponent";
  createdAt: number;
}

export interface AIAnalysis {
  id: string; // Add this field - unique identifier for the analysis document
  argumentId: string;
  userId: string;
  round: number;
  content: string; // AI's analysis text
  factCheck: FactCheck[]; // Fact checking results
  score: number; // Score (1-10)
  suggestedCounterpoints?: string[]; // Counter arguments the opponent could use
  createdAt: number;
}

export interface FactCheck {
  claim: string;
  verified: boolean;
  explanation: string;
}