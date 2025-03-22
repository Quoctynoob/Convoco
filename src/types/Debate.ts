// src/types/Debate.ts

import { Argument, AIAnalysis } from "./Argument";

export enum DebateStatus {
  PENDING = "pending",
  LOBBY = "lobby",     // New status for the lobby phase
  ACTIVE = "active",
  COMPLETED = "completed"
}

export interface Debate {
  id: string;
  topic: string;
  description: string;
  creatorId: string;
  opponentId?: string;
  winner?: string;
  creatorSide: "affirmative" | "negative";
  status: DebateStatus;
  rounds: number;
  currentRound: number;
  currentTurn?: string;
  createdAt: number;
  updatedAt: number;
  creatorReady?: boolean;    // New field to track if creator is ready
  opponentReady?: boolean;   // New field to track if opponent is ready
  forfeitedBy?: string;
  arguments: string[];
  aiAnalysis: AIAnalysis[];
}