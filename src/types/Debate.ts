// Update this in src/types/Debate.ts

export enum DebateStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  ABANDONED = "abandoned",
}

export interface Debate {
  id: string;
  topic: string;
  description: string;
  creatorId: string;
  opponentId?: string | null;
  creatorSide: "affirmative" | "negative";
  status: DebateStatus;
  rounds: number;
  currentRound: number;
  currentTurn?: string | null;
  winner?: string | null;
  forfeitedBy?: string | null; // New field to track who forfeited
  arguments: string[];
  aiAnalysis: string[];
  createdAt: number;
  updatedAt: number;
}
