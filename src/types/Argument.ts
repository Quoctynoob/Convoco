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
  id: string;
  argumentId: string;
  debateId: string;
  userId?: string; // Added this field to match your implementation
  round?: number;  // Added this field to match your implementation
  score: number;
  content: string;
  factCheck: FactCheck[];
  suggestedCounterpoints?: string[];
  createdAt: number;
}